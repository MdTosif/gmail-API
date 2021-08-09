const express = require('express');
const { addGmail, getGmail, getGmails } = require('./models/gmails');
const { getToken, oauthURL, sendEmail } = require('./utils');

const app = express();

app.use(express.urlencoded({ extended: true }));

app.use(express.json());

// redirecting to the permission sceen for token
app.get('/google', (req, res) => {
  res.redirect(oauthURL);
});

// the route where the oauth will redirect after successfull login
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

// getting all the email which are in db
app.get('/emails', async (req, res) => {
  const result = await getGmails();
  res.send(result);
});

// sending the email with gmail rest api
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

// catching any error
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.log(err);
  res.status(400).json({ error: err.message });
});
const port = process.env.PORT || 3000;
app.listen(port);
