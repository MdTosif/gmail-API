const express = require('express');
const { addGmail, getGmail, getGmails } = require('./models/gmails');
const { getToken, oauthURL, sendEmail } = require('./utils');

const app = express();

app.use(express.urlencoded({ extended: true }));

app.use(express.json());

app.get('/google', (req, res) => {
  res.redirect(oauthURL);
});

app.get('/g-auth', async (req, res, next) => {
  try {
    const { code } = req.query;
    const data = await getToken(code);
    if (data.error) throw new Error(data.error);
    const gmail = await addGmail(data.access_token);
    res.send(gmail);
  } catch (e) {
    next(e);
  }
});

app.get('/emails', async (req, res) => {
  const result = await getGmails();
  res.send(result);
});

app.post('/:email', async (req, res, next) => {
  try {
    const { email } = req.params;
    const { body } = req;
    const gmail = await getGmail(email);
    const result = await sendEmail({ ...body, ...gmail, from: email });
    if (result.error) throw new Error(result.error);
    res.send(result);
  } catch (e) {
    next(e);
  }
});

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.log(err);
  res.status(400).json({ error: err.message });
});
const port = process.env.PORT || 3000;
app.listen(port);
