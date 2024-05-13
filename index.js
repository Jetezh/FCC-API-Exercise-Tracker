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

app.post("/api/users/:_id/exercises", (req, res) => {
  const { _id, date, duration } = req.body;
  const index = dataUsers.findIndex((user) => user._id === _id);
  const description = req.body.description.toString();

  if(index !== -1) {
    // const username = dataUsers[index];

    if(description.length > 30) {
      res.json({message: "Description too long"});
    } else {

      if(!dataUsers[index].exercises) dataUsers[index].exercises = [];
      
      const newExercise = {
        description,
        duration, 
        date: date ? new Date(date).toDateString() : new Date().toDateString(),
      }
  
      dataUsers[index].exercises.push(newExercise);
  
      res.json({
        _id: dataUsers[index]._id,
        username: dataUsers[index].username,
        description: newExercise.description,
        duration: newExercise.duration,
        date: newExercise.date,
      })
    }
  } else {
    res.json({message: "user not found"});
  }
});

app.get("/api/users/:_id/logs", (req, res) => {
  const userId = req.params._id;
  const index = dataUsers.findIndex((user) => user._id === userId);
  const countExercise = dataUsers[index].exercises.length;

  res.json({
    _id: userId,
    username: dataUsers[index].username,
    count: countExercise,
    log: dataUsers[index].exercises,
  })
})

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
