const functions = require("firebase-functions");
const logger = require("firebase-functions/logger");
const { initializeApp } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
const { getStorage } = require('firebase-admin/storage');
const { getAuth } = require('firebase-admin/auth');

// Initialization of Firebase services
const admin = initializeApp({ projectId: 'photo-sharing-app-354f6' });
const auth = getAuth(admin);
const firestore = getFirestore(admin);
const storage = getStorage(admin);


// Middleware for handling CORS
const corsHandler = require('./corsMiddleware');


// Cloud Function: Fetch all users based on search query
exports.getUsers = functions.region('us-central1').https.onRequest((req, res) => {
  corsHandler(req, res, async () => {
    try {
      const searchQuery = req.query.search;
      const usersResult = await auth.listUsers();
      if (usersResult.users && Array.isArray(usersResult.users)) {
        const matchedUsers = usersResult.users.filter(user => user.email && user.email.includes(searchQuery));
        res.send(matchedUsers);
      } else {
        res.status(500).send('No users found.');
      }
    } catch (error) {
      res.status(500).send(error.message);
    }
  });
});

// Cloud Function: Registering a new user and storing the details in Firestore
exports.signUpUser = functions.region('us-central1').https.onRequest((req, res) => {
  corsHandler(req, res, async () => {
    const { email, uid, fullName } = req.body;
    if (!email || !uid || !fullName) {
      res.status(400).send('Required fields are missing');
      return;
    }
    try {
      const userRef = firestore.collection("users").doc(uid);
      const data = {
        uid,
        email,
        fullName,
        created_at: new Date().toISOString(),
      };
      await userRef.set(data);
      res.send({ data, msg: 'Operation successful', status: 200 });
    } catch (error) {
      res.status(500).send({ msg: error.message, status: 500 });
    }
  });
});

// Cloud Function: Personalize user profile with location, bio, and profile picture
exports.personalization = functions.region('us-central1').https.onRequest((req, res) => {
  corsHandler(req, res, async () => {
    const { location, bio, uid, profilePicUrl } = req.body;
    if (!location || !bio || !uid || !profilePicUrl) {
      res.status(400).send('Required fields are missing');
      return;
    }
    try {
      const userRef = firestore.collection("users").doc(uid);
      const userSnapshot = await userRef.get();
      if (!userSnapshot.exists) {
        res.status(404).send({ msg: 'User not found', status: 404 });
        return;
      }
      await userRef.update({
        location,
        bio,
        profilePic: profilePicUrl
      });
      res.send({ msg: 'User personalization successful', status: 200 });
    } catch (error) {
      res.status(500).send({ msg: error.message, status: 500 });
    }
  });
});

// Cloud Function: Send password reset email to user
exports.resetPassword = functions.region('us-central1').https.onRequest((req, res) => {
  corsHandler(req, res, async () => {
    const { email } = req.body;
    if (!email) {
      res.status(400).send('No email provided');
      return;
    }
    try {
      // Check if the user with the provided email exists
      const userRecord = await auth.getUserByEmail(email);

      // If the user exists, send a password reset email
      await auth.sendPasswordResetEmail(email);

      res.send({ msg: 'Password reset email sent', status: 200 });
    } catch (error) {
      if (error.code === 'auth/user-not-found') {
        // If user is not found, return a specific response
        res.status(404).send({ msg: 'User not found', status: 404 });
      } else {
        // Handle other errors
        res.status(500).send({ msg: error.message, status: 500 });
      }
    }
  });
});

// Cloud Function: Upload artwork to Firebase Storage and its details to Firestore
exports.uploadArt = functions.region('us-central1').https.onRequest((req, res) => {
  cors(req, res, async () => {
    const { title, file, uid } = req.body;
    if (!title || !file || !uid) {
      res.status(400).send('No title, file, or uid passed');
      return;
    }
    try {
      const bucket = storage.bucket();
      const filePath = `${uid}/${file.name}`; // Using the UID as a folder path
      const blob = bucket.file(filePath);
      const blobWriter = blob.createWriteStream({
        metadata: {
          contentType: file.type,
        },
      });
      blobWriter.on('error', (err) => {
        res.status(500).send({ msg: err.message, status: 500 });
      });
      blobWriter.on('finish', async () => {
        const publicUrl = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURI(blob.name)}?alt=media`;
        const artRef = firestore.collection("art").doc();
        const data = {
          title,
          uid,
          created_at: new Date().toISOString(),
          url: publicUrl,
        };
        await artRef.set(data);
        res.send({ data, msg: 'Operation successful', status: 200 });
      });
      blobWriter.end(file.buffer);
    } catch (error) {
      res.status(500).send({ msg: error.message, status: 500 });
    }
  });
});
