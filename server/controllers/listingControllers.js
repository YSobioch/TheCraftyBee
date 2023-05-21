require("dotenv").config();
const Listing = require('../models/listings')
const ListingPictures = require('../models/listingPicture')
const axios = require('axios')

exports.getAllListings = async (req, res, next) => {
    try {
        let [listings, _] = await Listing.findAll()

        for(let i = 0; i < listings.length; i++) {
            let listing = listings[i];
            let [listingPictures, _] = await ListingPictures.findAllPicturesByListingId(listing.id);
            listing.picures = listingPictures
        }
        res.status(200).json(listings)
    } catch (err) {
        console.log(err)
    }
}

exports.createNewListing = async (req, res, next) => {
    try {
        const { name, description, collection, color, shape, price, saleAmount } = req.body
        let listing = new Listing(name, description, collection, color, shape, price, saleAmount);

        listing.save();
        res.status(200);
    } catch (err) {
        console.log(err);
    }
} 

exports.getListingById = async (req, res, next) => {
    try {
        let [listing, _] = await Listing.findById(req.params.id);

        for(let i = 0; i < listing.length; i++) {
            let thisListing = listing[i];
            let [listingPictures, _] = await ListingPictures.findAllPicturesByListingId(req.params.id);
            thisListing.pictures = listingPictures
        }

        res.status(200).json(listing[0])
    } catch (err) {
        console.log(err)
    }
}

exports.getAllListingsInCollection = async (req, res, next) => {
    try {
        let [listings, _] = await Listing.findAllByCollectionId(req.params.id)

        for(let i = 0; i < listings.length; i++) {
            let listing = listings[i];
            let [listingPictures, _] = await ListingPictures.findAllPicturesByListingId(listing.id);
            listing.picures = listingPictures
        }

        res.status(200).json(listings)
    } catch (err) {
        console.log(err)
    }
}