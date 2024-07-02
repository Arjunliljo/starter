const dotenv = require('dotenv');
const fs = require('fs');
dotenv.config();

const { default: mongoose } = require('mongoose');

const Tour = require('./Models/tourModel');

const DATA_BASE = process.env.CONNECTION_STR.replace(
  '<PASSWORD>',
  process.env.DB_PASSWORD,
);

const tour = fs.readFileSync('./dev-data/data/tours-simple.json', 'utf-8');

//create data
const importData = async () => {
  try {
    await Tour.create(JSON.parse(tour));
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
