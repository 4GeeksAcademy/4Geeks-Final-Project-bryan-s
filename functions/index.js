const functions = require("firebase-functions");
const logger = require("firebase-functions/logger");
const { initializeApp } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
const { getStorage } = require('firebase-admin/storage');
const { getAuth } = require('firebase-admin/auth');

const admin = initializeApp({ projectId: 'photo-sharing-app-354f6' });
const auth = getAuth(admin);
const firestore = getFirestore(admin);
const storage = getStorage(admin);

const corsHandler = require('./corsMiddleware');

exports.helloWorld = functions.region('us-central1').https.onRequest((req, res) => {
  corsHandler(req, res, () => {
    logger.info("Hello logs!", {structuredData: true});
    res.send("Hello from Firebase!");
  });
});

exports.getUsers = functions.region('us-central1').https.onRequest((req, res) => {
  corsHandler(req, res, async () => {
    try {
      const users = await auth.listUsers();
      logger.info(users);
      res.send(users);
    } catch (error) {
      res.status(500).send(error.message);
    }
  });
});

exports.signUpUser = functions.region('us-central1').https.onRequest((req, res) => {
  corsHandler(req, res, async () => {
    const { email, uid, fullName } = req.body; // Added fullName

    if (!email || !uid || !fullName) {  // Checking if fullName is also provided
      res.status(400).send('Required fields are missing');
      return;
    }

    try {
      const userRef = firestore.collection("users").doc(uid);
      const data = {
        uid: uid,
        email,
        fullName, // Saving fullName
        created_at: new Date().toISOString(),
      };
      await userRef.set(data);
      res.send({ data, msg: 'Operation successful', status: 200 });
    } catch (error) {
      res.status(500).send({ msg: error.message, status: 500 });
    }
  });
});

exports.personalization = functions.region('us-central1').https.onRequest((req, res) => {
  corsHandler(req, res, async () => {
    const { location, bio, uid, profilePicUrl } = req.body;

    if (!location || !bio || !uid || !profilePicUrl) {
      res.status(400).send('Required fields are missing');
      return;
    }

    try {
      const userRef = firestore.collection("users").doc(uid);

      // Check if the user exists
      const userSnapshot = await userRef.get();
      if (!userSnapshot.exists) {
        res.status(404).send({ msg: 'User not found', status: 404 });
        return;
      }

      await userRef.update({
        location: location,
        bio: bio,
        profilePic: profilePicUrl  // updating the profile picture URL
      });

      res.send({ msg: 'User personalization successful', status: 200 });
    } catch (error) {
      res.status(500).send({ msg: error.message, status: 500 });
    }
  });
});


exports.resetPassword = functions.region('us-central1').https.onRequest((req, res) => {
  corsHandler(req, res, async () => {
    const { email } = req.body;

    if (!email) {
      res.status(400).send('No email provided');
      return;
    }

    try {
      await auth.sendPasswordResetEmail(email);
      res.send({ msg: 'Password reset email sent', status: 200 });
    } catch (error) {
      res.status(500).send({ msg: error.message, status: 500 });
    }
  });
});

exports.uploadArt = functions.region('us-central1').https.onRequest((req, res) => {
  cors(req, res, async () => {
    const { title, file, uid } = req.body;

    if (!title || !file || !uid) {
        res.status(400).send('No title, file, or uid passed');
        return;
    }

    try {
        const bucket = storage.bucket();
        const filePath = `${uid}/${file.name}`;  // Use the UID as a folder
        const blob = bucket.file(filePath);  // Updated path here
        const blobWriter = blob.createWriteStream({
            metadata: {
                contentType: file.type,
            },
        });

        blobWriter.on('error', (err) => {
            console.error(err);
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