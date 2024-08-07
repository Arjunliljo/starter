const dotenv = require('dotenv');
dotenv.config();

process.on('uncaughtException', (err) => {
  console.log(err.name, err);
  console.log(`UNHANDLED EXCEPTION , Shutting down...`);
  process.exit(1);
});
process.on('unhandledRejection', (err) => {
  console.log(err.name, err);
  console.log(`UNHANDLED REJECTION , Shutting down...`);
  server.close(() => process.exit(1));
});

const { default: mongoose } = require('mongoose');
const app = require('../app');

const DATA_BASE = process.env.CONNECTION_STR.replace(
  '<PASSWORD>',
  process.env.DB_PASSWORD,
);

mongoose.connect(DATA_BASE).then((con) => {
  console.log('Database connected..');
});

const port = process.env.PORT || 3000;

const server = app.listen(port, () => {
  console.log('App running on port ' + port);
});
