const dotenv = require('dotenv');
const fs = require('fs');
dotenv.config();

const { default: mongoose } = require('mongoose');

const Tour = require('./Models/tourModel');
const User = require('./Models/userModel');
const Review = require('./Models/reviewModel');

const DATA_BASE = process.env.CONNECTION_STR.replace(
  '<PASSWORD>',
  process.env.DB_PASSWORD,
);

const tour = fs.readFileSync('./dev-data/data/tours.json', 'utf-8');
const reviews = fs.readFileSync('./dev-data/data/reviews.json', 'utf-8');
const users = fs.readFileSync('./dev-data/data/users.json', 'utf-8');

//create data
const importData = async () => {
  try {
    await Tour.create(JSON.parse(tour));
    await User.create(JSON.parse(users), { validateBeforeSave: false });
    await Review.create(JSON.parse(reviews));
    console.log('Data created succesfully');
  } catch (err) {
    console.log(err);
  }
  process.exit(); //aggressive way of quiting application not recomanded
};

//delete data
const deleteData = async () => {
  try {
    await Tour.deleteMany();
    await User.deleteMany();
    await Review.deleteMany();
    console.log('Deleted all data');
  } catch (err) {
    console.log(err);
  }
  process.exit(); //aggressive way of quiting application not recomanded
};
console.log(process.argv);

if (process.argv[2] === '--import') importData();
if (process.argv[2] === '--delete') deleteData();

mongoose
  .connect(DATA_BASE)
  .then((con) => {
    console.log('Database connected..');
  })
  .catch((err) => {
    console.error('Database connection error:', err);
  });
