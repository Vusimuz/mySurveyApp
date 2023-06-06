const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const DataModel = require('./models/data'); 

const app = express();
const port = 3001;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('public'));


const url = 'mongodb://localhost:27017/mysurveydb';


mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected successfully to MongoDB');
  })
  .catch((err) => {
    console.error('Failed to connect to MongoDB:', err);
  });


function setTextContent(elementId, text) {
  const element = document.getElementById(elementId);
  if (element) {
    element.textContent = text;
  }
}

app.post("http:/DataEntry", (req, res) => {
  var surname = req.body.surname;
  var name = req.body.name;
  var contact = req.body.contact;
  var currentDate = req.body.date;
  var age = req.body.age;

  var favoriteFoods = [];
  if (req.body.checkbox1) {
    favoriteFoods.push("Pizza");
  }
  if (req.body.checkbox2) {
    favoriteFoods.push("Pasta");
  }
  if (req.body.checkbox3) {
    favoriteFoods.push("Pap % Wors");
  }
  if (req.body.checkbox4) {
    favoriteFoods.push("Chicken Stir Fry");
  }
  if (req.body.checkbox5) {
    favoriteFoods.push("Beef Stir Fry");
  }
  if (req.body.checkbox6) {
    favoriteFoods.push("Others");
  }

  var ratings = {
    eatOut: req.body.option1,
    watchMovies: req.body.option2,
    watchTV: req.body.option3,
    listenToRadio: req.body.option4
  };

  const newData = new DataModel({
    surname: surname,
    name: name,
    contact: contact,
    currentDate: currentDate,
    age: age,
    favoriteFoods: favoriteFoods,
    ratings: ratings
  });

  newData.save()
    .then(() => {
      res.redirect('/index.html'); 
    })
    .catch((err) => {
      console.error("Failed to save data:", err);
      res.status(500).send("An error occurred while saving data.");
    });
});

app.get("/api/survey-data", (req, res) => {
 
  DataModel.find()
    .then((data) => {
      const surveyData = {
        totalSurveys: data.length,
        averageAge: calculateAverageAge(data),
        oldestPerson: calculateOldestPerson(data),
        youngestPerson: calculateYoungestPerson(data),
        pizzaPercentage: calculateFoodPercentage(data, "Pizza"),
        pastaPercentage: calculateFoodPercentage(data, "Pasta"),
        papWorsPercentage: calculateFoodPercentage(data, "Pap % Wors"),
        eatOutRating: calculateAverageRating(data, "eatOut"),
        watchMoviesRating: calculateAverageRating(data, "watchMovies"),
        watchTVRating: calculateAverageRating(data, "watchTV"),
        listenToRadioRating: calculateAverageRating(data, "listenToRadio")
      };

      res.json(surveyData);
    })
    .catch((err) => {
      console.error("Failed to retrieve survey data:", err);
      res.status(500).send("An error occurred while retrieving survey data.");
    });
});


function calculateAverageAge(data) {
  const totalAge = data.reduce((sum, entry) => sum + entry.age, 0);
  return Math.round(totalAge / data.length);
}

function calculateOldestPerson(data) {
  return Math.max(...data.map((entry) => entry.age));
}

function calculateYoungestPerson(data) {
  return Math.min(...data.map((entry) => entry.age));
}

function calculateFoodPercentage(data, food) {
  const count = data.reduce((sum, entry) => {
    if (entry.favoriteFoods.includes(food)) {
      return sum + 1;
    }
    return sum;
  }, 0);
  return Math.round((count / data.length) * 100);
}

function calculateAverageRating(data, rating) {
  const totalRating = data.reduce((sum, entry) => sum + entry.ratings[rating], 0);
  return (totalRating / data.length).toFixed(1);
}

app.use(express.static('public'));

app.listen(port, () => {
  console.log("Server is running on port", port);
});

