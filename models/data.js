const mongoose = require('mongoose');

// Create a schema for your data
const DataSchema = new mongoose.Schema({
  surname: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  contact: {
    type: String,
    required: true
  },
  currentDate: {
    type: Date,
    required: true
  },
  age: {
    type: Number,
    required: true
  },
  favoriteFoods: [{
    type: String
  }],
  ratings: {
    eatOut: Number,
    watchMovies: Number,
    watchTV: Number,
    listenToRadio: Number
  }
});

// Create a model based on the schema
const DataModel = mongoose.model('Data', DataSchema);

// Export the model
module.exports = DataModel;
