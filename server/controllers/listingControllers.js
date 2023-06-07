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
            listing.pictures = listingPictures
        }
        res.status(200).json(listings)
    } catch (err) {
        console.log(err)
    }
}

exports.createNewListing = async (req, res, next) => {
    try {
        let { name, description, description_long, collection, color, shape, price, saleAmount } = req.body
        let listing = new Listing(name, description, description_long, collection, color, shape, price, saleAmount);

        await listing.save();
        res.status(200).json({"createdListing": true});
    } catch (err) {
        console.log(err);
    }
} 

exports.updateListing = async (req, res, next) => {
    try {
        let {id, name, description, description_long, collection, color, shape, price, saleAmount} = req.body
        await Listing.updateListing(id, name, description, description_long, collection, color, shape, price, saleAmount)

        res.status(200).json({"updated": true})
    } catch (err) {
        console.log(err)
        res.status(500).json({"updated": false})
    }
}

exports.deleteListing = async (req, res, next) => {
    try {
        let id = req.body.id;
        Listing.deleteListing(id)

        res.status(200).json({"deleted": true})
    } catch (err) {
        console.log(err)
        res.status(500).json({"deleted": false})
    }
}

exports.getLastListing = async (req, res, next) => {
    try {
        let [listing] = await Listing.getNewestListingId()
        listing = listing[0]
        res.status(200).json({"listingId": listing.id})
    } catch (err) {
        console.log(err)
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
        let { shapes, colors, collection } = req.query

        let [listings, _] = await Listing.findAllByCollectionId(collection, shapes, colors)
        
        for(let i = 0; i < listings.length; i++) {
            let listing = listings[i];
            let [listingPictures, _] = await ListingPictures.findAllPicturesByListingId(listing.id);
            listing.pictures = listingPictures
        }

        res.status(200).json(listings)
    } catch (err) {
        console.log(err)
    }
}