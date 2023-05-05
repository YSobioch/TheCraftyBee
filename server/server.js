require("dotenv").config();

const express = require('express');
const cors = require('cors');
const app = express();
const methodOverride = require('method-override')
const fileUpload = require('express-fileupload')
const listingsRoute = require('./routes/listings');
const picturesRoute = require('./routes/pictures');
const listingPicturesRoute = require('./routes/listing_pictures')
const usersRoute = require('./routes/users')
const collectionRoute = require('./routes/collections')

app.use(cors());
app.use(express.json());
app.use(fileUpload())
app.use(methodOverride('_method'))
app.use('/listings', listingsRoute)
app.use('/pictures', picturesRoute)
app.use('/listingPictures', listingPicturesRoute)
app.use('/collections', collectionRoute)
app.use('/users', usersRoute)
app.post('/', (req, res) => {res.send('ended up here')})

app.listen(8000, () => {
    console.log('Server is running on port 8000')
})