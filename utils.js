const qs = require('querystring');
const { default: fetch } = require('node-fetch');

const { client_id, client_secret, redirect_uri } = require('./credentials');

const stringifiedParams = qs.encode({
  client_id,
  redirect_uri,
  scope: [
    'https://www.googleapis.com/auth/gmail.send',
    'https://www.googleapis.com/auth/userinfo.email',
    'https://www.googleapis.com/auth/userinfo.profile',
  ].join(' '), // space seperated string
  response_type: 'code',
  access_type: 'offline',
  prompt: 'consent',
});

async function getToken(code) {
  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      client_id,
      client_secret,
      redirect_uri,
      grant_type: 'authorization_code',
      code,
    }),
  });
  const body = await res.json();
  return body;
}

function emailData(data) {
  const stringBody = `${'Content-Type: text/plain; charset="UTF-8"\n'
  + 'MIME-Version: 1.0\n'
  + 'Content-Transfer-Encoding: 7bit\n'
  + `Subject: ${data.subject}\n`
  + `From: ${data.from}\n`
  + `To: ${data.to}\n\n`}${
    data.body}`;

  const result = Buffer.from(stringBody).toString('base64').replace(/\+/g, '-').replace(/\//g, '_');
  const raw = JSON.stringify({
    raw: result,
  });
  return raw;
}

async function sendEmail(data) {
  const body = emailData(data);
  const reqURI = `https://gmail.googleapis.com/gmail/v1/users/${qs.encode(data.email)}/messages/send?access_token=${data.token}`;
  const res = await fetch(reqURI, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body,

  });
  const result = await res.json();
  return result;
}

module.exports = {
  getToken,
  emailData,
  oauthURL: `https://accounts.google.com/o/oauth2/v2/auth?${stringifiedParams}`,
  sendEmail,
};
