const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const { PORT } = require('./config.js');

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  next();
});

app.use(cors({
  origin: ['http://localhost:5000',
    'http://gamebrag.onrender.com',
    'https://gamebrag.onrender.com'], credentials: true
}))

// Analizar solicitudes con express.json y express.urlencoded
app.use(bodyParser.urlencoded({ limit: '100mb', extended: true }));
app.use(bodyParser.json({ limit: '100mb' }));

// Routes
app.use(require('./routes/index'));

app.listen(PORT, () => {
  console.log(`app listo en el puerto ${PORT}`);
});