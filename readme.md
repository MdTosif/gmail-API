- **/google** route is for adding the gmail, token in db
- **/emails** route is to getting all the gmail are register in the db
- **/<example@gmail.com>** is the route to send email (email, token should exist in db)
- every route is GET except **/<example@gmail.com>**
- **/<example@gmail.com>** require json body to send email, example json body :-
  {
  "subject":"testEmail",
  "to":"mdtosif0mt@gmail.com",
  "body":"xtz"
  }

- to test the routes are
- https://gmail-rest.herokuapp.com/google 'GET'
- https://gmail-rest.herokuapp.com/emails 'GET'
- https://gmail-rest.herokuapp.com/s9h1rkh9n2@gmail.com 'POST' (with json body)
