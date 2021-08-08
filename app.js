const express = require('express');
const { addGmail, getGmail, getGmails } = require('./models/gmails');
const { getToken, oauthURL, sendEmail } = require('./utils');

const app = express();

app.use(express.urlencoded({ extended: true }));

app.use(express.json());

app.get('/google', (req, res) => {
  res.redirect(oauthURL);
});

app.get('/g-auth', async (req, res) => {
  const { code } = req.query;
  const data = await getToken(code);
  if (data.error) throw new Error(data.error);
  const gmail = await addGmail(data.access_token);
  res.send(gmail);
});

app.get('/emails', async (req, res) => {
  const result = await getGmails();
  res.send(result);
});

app.post('/:email', async (req, res) => {
  const { email } = req.params;
  const { body } = req;
  const gmail = await getGmail(email);
  const result = await sendEmail({ ...body, ...gmail });
  if (result.error) throw new Error(result.error);
  res.send(result);
});

app.listen(3000);
