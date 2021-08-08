const baseURL = process.env.BASE_URL || 'http://localhost:3000';
module.exports = {
  baseURL,
  client_id: process.env.CLIENT_ID || 'Your Google client ID',
  client_secret: process.env.CLIENT_SECRET || 'Your google secret',
  redirect_uri: `${baseURL}/g-auth`, // set the redirect uri in you google Oauth
  dbURI: process.env.DB_URI || 'mongodb://localhost:27017',
};
