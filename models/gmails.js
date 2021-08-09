const { default: fetch } = require('node-fetch');
const mongoose = require('./db');

const GmailModel = mongoose.model('gmail', mongoose.Schema({
  email: {
    type: String,
    unique: true,
  },
  token: String,
}));

// add email and token to the db
async function addGmail(token) {
  // getting the email from the token
  const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const body = await res.json();
  const gmail = await GmailModel.findOne({ email: body.email });
  // if email, token don't exist creating new one
  if (gmail === {}) {
    const result = GmailModel({ ...body, token }).save();
    return result;
  }
  // if the email token already exist overwrite the document
  gmail.token = token;
  const result = await gmail.save();
  return result;
}

// returning the token , email from the db
async function getGmail(email) {
  const gmail = await GmailModel.findOne({ email }).lean();
  return gmail;
}

// getting all email which is in db
async function getGmails() {
  const gmail = await GmailModel.find().select('-token').lean();
  return gmail;
}

module.exports = {
  addGmail,
  getGmail,
  getGmails,
};
