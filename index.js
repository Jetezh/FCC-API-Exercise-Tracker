require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const { nanoid } = require('nanoid');

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(express.json());

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html');
});

const dataUsers = [];

app.post("/api/users", (req, res) => {
  const username = req.body.username;

  if (!username) {
    return res.json({ message: "Please input username" });
  }

  const _id = nanoid(24);
  const newUser = {
    _id,
    username
  };

  dataUsers.push(newUser);

  res.json(newUser);
});

app.get("/api/users", (req, res) => {
  let dataUsersFiltered = [...dataUsers];

  if (dataUsersFiltered.length === 0) {
    return res.json({ message: "There is no user" });
  }

  res.json(dataUsersFiltered.map((user) => ({
    _id: user._id,
    username: user.username
  })));
});

app.post("/api/users/:_id/exercises", (req, res) => {
  const { date, duration, description } = req.body;
  const { _id } = req.params;
  const index = dataUsers.findIndex((user) => user._id === _id);

  if (index !== -1) {
    if (typeof description !== 'string' || description.length > 30) {
      return res.json({ message: "Description must be a string and no longer than 30 characters" });
    }

    const durationNumber = parseInt(duration);
    if (isNaN(durationNumber)) {
      return res.json({ message: "Duration must be a number" });
    }

    if (!dataUsers[index].exercises) {
      dataUsers[index].exercises = [];
    }

    const newExercise = {
      description: description.toString(),
      duration: durationNumber,
      date: date ? new Date(date).toDateString() : new Date().toDateString(),
    };

    dataUsers[index].exercises.push(newExercise);

    res.json({
      _id: dataUsers[index]._id,
      username: dataUsers[index].username,
      description: newExercise.description,
      duration: newExercise.duration,
      date: newExercise.date,
    });
  } else {
    res.json({ message: "User not found" });
  }
});

app.get("/api/users/:_id/logs", (req, res) => {
  const { from, to, limit } = req.query;
  const { _id } = req.params;
  const index = dataUsers.findIndex((user) => user._id === _id);

  if (index !== -1) {
    let exercises = dataUsers[index].exercises || [];

    if (from) {
      const fromDate = new Date(from);
      exercises = exercises.filter(exercise => new Date(exercise.date) >= fromDate);
    }

    if (to) {
      const toDate = new Date(to);
      exercises = exercises.filter(exercise => new Date(exercise.date) <= toDate);
    }

    if (limit) {
      exercises = exercises.slice(0, parseInt(limit));
    }

    res.json({
      _id: dataUsers[index]._id,
      username: dataUsers[index].username,
      count: exercises.length,
      log: exercises
    });
  } else {
    res.json({ message: "User not found" });
  }
});

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port);
});
