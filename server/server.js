require("dotenv").config();

const express = require('express');
const cors = require('cors');
const app = express();
const fileUpload = require('express-fileupload')
const listingsRoute = require('./routes/listings');
const picturesRoute = require('./routes/pictures');
const listingPicturesRoute = require('./routes/listing_pictures')
const collectionRoute = require('./routes/collections')

app.use(cors());
app.use(express.json());
app.use(fileUpload())
app.use('/listings', listingsRoute)
app.use('/pictures', picturesRoute)
app.use('/listingPictures', listingPicturesRoute)
app.use('/collections', collectionRoute)
app.post('/', (req, res) => {res.send('ended up here')})

app.listen(8000, () => {
    console.log('Server is running on port 8000')
})