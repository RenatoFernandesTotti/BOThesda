module.exports = _ => {
    global.fbAdm = require("firebase-admin");
    fbAdm.initializeApp({
        credential: fbAdm.credential.cert(JSON.parse(process.env.FB_ADM_KEY)),
        databaseURL: "https://soundboardbot-ed2d4.firebaseio.com"
    });
    global.db = fbAdm.firestore()
}