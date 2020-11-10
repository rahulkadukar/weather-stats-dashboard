const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 4000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/api/hello', (req, res) => {
  res.send({ express: 'Hello From Express' });
});

app.post('/api/weatherStats', (req, res) => {
  res.send({ name: 'Rahul Kadukar Test' });
});

app.listen(port, () => console.log(`Listening on port ${port}`));