const admin          = require("firebase-admin");
const serviceAccount = require("./service.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: "jsmonday-cms.appspot.com"
});

module.exports = admin;
