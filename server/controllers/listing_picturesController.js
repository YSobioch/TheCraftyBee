const ListingPicture = require('../models/listingPicture')

exports.getAllListing_Pictures = async (req, res, next) => {
    res.send("<h3>Random Picture</h3><img src='http://localhost:8000/pictures/1'>")
}

exports.createNewListing_Picture = async (req, res, next) => {
    let listingPicture;
    try {
        listingPicture = new ListingPicture(req.body.owner_id, req.body.picture_id);
        listingPicture.save();
        res.status(200).send("created");
    } catch (err) {
        console.log(err)
        res.redirect('/')
    }
} 

exports.getListing_PicturesByListingId = async (req, res, next) => {
    try {
        let [pictureIds, _] = await ListingPicture.findAllPicturesByListingId(req.params.id);
        res.json(pictureIds)
    } catch (err) {
        console.log(err)
    }
}