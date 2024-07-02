const dotenv = require('dotenv');
dotenv.config();

const { default: mongoose } = require('mongoose');
const app = require('./app');

const DATA_BASE = process.env.CONNECTION_STR.replace(
  '<PASSWORD>',
  process.env.DB_PASSWORD,
);

mongoose
  .connect(DATA_BASE)
  .then((con) => {
    console.log('Database connected..');
  })
  .catch((err) => {
    console.error('Database connection error:', err);
  });

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log('App running on port ' + port);
});
