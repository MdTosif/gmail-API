const { default: fetch } = require('node-fetch');

const { client_id, client_secret, redirect_uri } = require('./credentials');

// making the oauth uri to take the permisssion from google
const params = new URLSearchParams();
params.append('client_id', client_id);
params.append('redirect_uri', redirect_uri);
params.append('scope', [
  'https://www.googleapis.com/auth/gmail.send',
  'https://www.googleapis.com/auth/userinfo.email',
  'https://www.googleapis.com/auth/userinfo.profile',
].join(' '));
params.append('response_type', 'code');
params.append('access_type', 'offline');
params.append('prompt', 'consent');
const stringifiedParams = params.toString();

// getting the token  from the code which we get from the google oauth
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

// genrating the email data in base 64 to send in the body of the gmail rest API call
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

// making the gmail rest api call to send email
async function sendEmail(data) {
  const body = emailData(data);
  const reqURI = `https://gmail.googleapis.com/gmail/v1/users/${data.email}/messages/send?access_token=${data.token}`;
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
