require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const { nanoid } = require('nanoid');

app.use(cors());
app.use(express.urlencoded({ extended: true}));
app.use(express.static('public'));
app.use(express.json());

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

const dataUsers = [];

app.post("/api/users", (req, res) => {
  const username = req.body.username;

  if(!username) {
    return res.json({message: "Please input username"})
  };

  const _id = nanoid(24);
  const newUser = {
    _id,
    username
  }

  dataUsers.push(newUser);
  
  res.json(newUser);
});

app.get("/api/users", (req, res) => {
  let dataUsersFiltered = [...dataUsers];

  if(dataUsersFiltered === 0) {
    return res.json({message: "There is no user"});
  }

  res.json(dataUsersFiltered.map((user) => ({
      _id: user._id,
      username: user.username
    }))
  )
});

app.post("api/users/:_id/exercises", (req, res) => {
  
  
  const {
    _id,
    username,
    date,
    duration,
    description
  } = req.body;

  
});

app.get("api/users/:_id/logs", (req, res) => {
  
})

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
