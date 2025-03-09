const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const authRoutes = require('./routes/authRoutes');
const scanRoutes = require('./routes/scanRoutes');
const historyRoutes = require('./routes/historyRoutes');
const analyticRoutes=require('./routes/analyticsRoutes')
const app = express();

app.use(cors({
  origin: 'http://127.0.0.1:5500', // or '*'
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));


app.use('/', authRoutes);
app.use('/scan', scanRoutes);
app.use('/history', historyRoutes);
app.use('/',analyticRoutes)

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
