export default () => {
  global.fbAdm = require('firebase-admin');
  if (process.env.FB_ADM_KEY === undefined) {
    global.LOGGER.emerg('FB_ADM_KEY not in env');
    process.exit();
  }
  global.fbAdm.initializeApp({
    credential: global.fbAdm.credential
        .cert(JSON.parse(process.env.FB_ADM_KEY)),
    databaseURL: 'https://soundboardbot-ed2d4.firebaseio.com',
  });
  global.db = global.fbAdm.firestore();
};
