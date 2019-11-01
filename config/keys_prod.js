// API keys, hidden for production enviorements
module.exports = {
   MongoURI: process.env.MONGO_URI,
   googleClientID: process.env.GOOGLE_CLIENT_ID,
   googleClientSecret: process.env.GOOGLE_CLIENT_SECTET,
   facebookClientID: process.env.FACEBOOK_CLIENT_ID,
   facebookClientSecret: process.env.FACEBOOK_CLIENT_SECRET,
   gmailPassword: process.env.GMAIL_PASSWORD
}