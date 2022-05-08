const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelper');
const Campground = require('../models/campground');

async function main() {
  await mongoose
    .connect('mongodb://localhost:27017/yelpcamp')
    .then(console.log('Database Connected'));
}

main().catch((err) => console.log(err));

const sample = (array) => array[Math.floor(Math.random() * array.length)];

async function seedDB() {
  await Campground.deleteMany({});
  for (let i = 0; i < 500; i++) {
    const random1000 = Math.floor(Math.random() * 1000);
    const price = Math.floor(Math.random() * 20) + 10;
    const camp = new Campground({
      author: '625cdd6e5425133b41908c12', // User is Kenzo
      location: `${cities[random1000].city}, ${cities[random1000].state}`,
      title: `${sample(descriptors)} ${sample(places)}`,
      description:
        'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Mollitia accusantium, aliquid ab totam qui expedita deleniti hic eos a delectus dicta ex atque explicabo iusto velit, laboriosam distinctio unde quisquam.',
      price,
      geometry: {
        type: 'Point',
        coordinates: [
          cities[random1000].longitude,
          cities[random1000].latitude,
        ],
      },
      images: [
        {
          url: 'https://res.cloudinary.com/di7euib4q/image/upload/v1651967208/YelpCamp/qisaf08suq2hes2qgk5m.jpg',
          filename: 'YelpCamp/qisaf08suq2hes2qgk5m',
        },
        {
          url: 'https://res.cloudinary.com/di7euib4q/image/upload/v1651967209/YelpCamp/fuudrhi9rlzxucqruk6k.jpg',
          filename: 'YelpCamp/fuudrhi9rlzxucqruk6k',
        },
        {
          url: 'https://res.cloudinary.com/di7euib4q/image/upload/v1651967209/YelpCamp/a5alt2w6ftyhj4wu2rmi.jpg',
          filename: 'YelpCamp/a5alt2w6ftyhj4wu2rmi',
        },
      ],
    });
    await camp.save();
  }
}

seedDB();
