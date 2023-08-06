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

const corsHandler = require('./corsMiddleware'); // add this line to import your cors middleware

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

exports.signInUser = functions.region('us-central1').https.onRequest((req, res) => {
  corsHandler(req, res, async () => {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).send('No email or password passed');
      return;
    }

    try {
      const userRecord = await auth.getUserByEmail(email);
      // More checks can be done here to verify the user and password
      const userRef = firestore.collection("user").doc(userRecord.uid);
      const snapshot = await userRef.get();
      const data = snapshot.data();
      res.send({ data, msg: 'Operation successful', status: 200 });
    } catch (error) {
      res.status(500).send({ msg: error.message, status: 500 });
    }
  });
});

exports.signUpUser = functions.region('us-central1').https.onRequest((req, res) => {
  corsHandler(req, res, async () => {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).send('No email or password passed');
      return;
    }

    try {
      const userRecord = await auth.createUser({ email, password });
      const userRef = firestore.collection("user").doc(userRecord.uid);
      const data = {
        uid: userRecord.uid,
        email,
        created_at: new Date().toISOString(),
      };
      await userRef.set(data);
      res.send({ data, msg: 'Operation successful', status: 200 });
    } catch (error) {
      res.status(500).send({ msg: error.message, status: 500 });
    }
  });
});

exports.uploadArt = functions.region('us-central1').https.onRequest((req, res) => {
  corsHandler(req, res, async () => {
    const {title, file, uid} = req.body;

    if (!title || !file || !uid) {
      res.status(400).send('No title, file or uid passed');
      return;
    }

    try {
      const bucket = storage.bucket();
      const blob = bucket.file(file.name);
      const blobWriter = blob.createWriteStream({
        metadata: {
          contentType: file.type,
        },
      });

      blobWriter.on('error', (err) => {
        logger.error(err);
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

