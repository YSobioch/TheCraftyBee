require("dotenv").config();

const express = require('express');
const cors = require('cors');
const app = express();
const indexRoute = require('./routes/index');

app.use(cors());
app.use(express.json());

app.use('/', indexRoute)

app.listen(8000, () => {
    console.log('Server is running on port 8000')
})