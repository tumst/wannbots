'use strict'

// https://firebase.google.com/docs/database/admin/start
// Firebase Admin
const admin = require("firebase-admin");
// var x = require("")

const serviceAccount = {
  "type": "service_account",
  "project_id": process.env.PROJECT_ID,
  "private_key_id": process.env.PRIVATE_KEY_ID,
  "private_key": process.env.PRIVATE_KEY,
  "client_email": process.env.CLIENT_EMAIL,
  "client_id": process.env.CLIENT_ID,
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": process.env.CLIENT_CERT_URL
}


admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://wanndb-ea5d0.firebaseio.com"
});


// The app only has access to public data as defined in the Security Rules
const db = admin.database();
// const ref = db.ref('/queueName/approve_rawmat_picking');
// const ref2 = db.ref('/queueName/rawmat_receive_isempty_emb01');

const firebaser = (queueName, messages) => {
  console.log('Firebaser...');
  const ref = db.ref('/queueName/' + queueName);
  
  // save to firebase
  ref.set(messages);
  console.log('[x] Sent %s', messages);

}


module.exports = {
  firebaser
}
