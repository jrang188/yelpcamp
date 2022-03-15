const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const cities = require('./cities');
const {places, descriptors} = require("./seedHelper");
const Campground = require('../models/campground');

async function main() {
    await mongoose.connect('mongodb://localhost:27017/yelpcamp')
    .then(console.log("Database Connected"));
}

main().catch(err => console.log(err));

const sample = array => array[Math.floor(Math.random() * array.length)];

async function seedDB() {
    await Campground.deleteMany({});
    for (let i = 0; i < 50; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const camp = new Campground({
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`
        });
        await camp.save();
    }
}

seedDB();