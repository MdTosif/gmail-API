const { default: fetch } = require('node-fetch');
const mongoose = require('./db');

const GmailModel = mongoose.model('gmail', mongoose.Schema({
  email: String,
  token: String,
}));

async function addGmail(token) {
  const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const body = await res.json();
  const result = GmailModel({ ...body, token }).save();
  return result;
}

async function getGmail(email) {
  const gmail = await GmailModel.findOne({ email }).lean();
  return gmail;
}

async function getGmails() {
  const gmail = await GmailModel.find().select('-token').lean();
  return gmail;
}

module.exports = {
  addGmail,
  getGmail,
  getGmails,
};
