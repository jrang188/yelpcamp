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
  for (let i = 0; i < 50; i++) {
    const random1000 = Math.floor(Math.random() * 1000);
    const price = Math.floor(Math.random() * 20) + 10;
    const camp = new Campground({
      author: '625cdd6e5425133b41908c12',
      location: `${cities[random1000].city}, ${cities[random1000].state}`,
      title: `${sample(descriptors)} ${sample(places)}`,
      description: 'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Mollitia accusantium, aliquid ab totam qui expedita deleniti hic eos a delectus dicta ex atque explicabo iusto velit, laboriosam distinctio unde quisquam.',
      price,
      images: [
        {
          url: 'https://res.cloudinary.com/di7euib4q/image/upload/v1651730949/YelpCamp/imqpe5xabolcqkuyrnca.jpg',
          filename: 'YelpCamp/imqpe5xabolcqkuyrnca',
        },
        {
          url: 'https://res.cloudinary.com/di7euib4q/image/upload/v1651730950/YelpCamp/dlv56jtzwc0d0fsws0ym.jpg',
          filename: 'YelpCamp/dlv56jtzwc0d0fsws0ym',
        },
      ],
    });
    await camp.save();
  }
}

seedDB();
