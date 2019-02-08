const axios = require('axios');
const mongoose = require('mongoose');
const Country = require('../models/country');

mongoose.connect('mongodb://localhost:27017/travelLog', { useNewUrlParser: true })
  .then(() => {
    console.log('connected');
    return Country.deleteMany();
  })
  .then(() => {
    console.log('deleted');
    return axios.get('https://restcountries.eu/rest/v2/all?fields=name;capital;region;subregion;population;latlng;area;languages;flag;regionalBlocs');
  })
  .then((res) => {
    console.log('accessed API');
    const { data } = res;
    const cleanData = data.map((country) => {
      let lat = country.latlng[0] || 0;
      let lng = country.latlng[1] || 0;
      country.location = {
        type: 'Point',
        coordinates: [lng, lat],
      };
      delete country.latlng;
      return country;
    });

    return Country.insertMany(cleanData);
  })
  .then(() => {
    console.log('loaded data');
    mongoose.connection.close();
  })
  .catch((err) => {
    console.log('error ', err);
  });