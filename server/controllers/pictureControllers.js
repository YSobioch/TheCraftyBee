const Picture = require('../models/pictures')
const Collection = require('../models/collections')
const fs = require('fs')

exports.getAllPictures = async (req, res, next) => {
    try{
        let [pictures, _] = await Picture.getAllPictures()

        res.status(200).json(pictures)
    } catch (err) {
        console.log(err)
    }

    `
        <form action="./pictures/" method="POST" encType="multipart/form-data">
        <h3>Upload a photo</h3>
        <input type="file" name="sampleFile" accept="image/*">
        <input type="text" name="name">
        <input type="submit">
        </form>
    `
}

//For POST requests use sampleFile as file
exports.createNewPicture = async (req, res, next) => {
    try {
    let sampleFile;
    let uploadPath;

    if(!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).send('No files were uploaded')
    }

    // name of the input is sampleFile
    sampleFile = req.files.sampleFile
    uploadPath = '../server/images/' + sampleFile.name;

    let picture = new Picture(sampleFile.name);
    picture.save()

    // Use mv() to place file on the server
    sampleFile.mv(uploadPath, function(err) {
        if(err) return res.status(500).send(err);

        res.status(200).json({"PictureCreated": true});
    })

    } catch (err) {
        console.log(err)
        res.status(500).json({"PictureCreated": false})
    }
}


exports.deletePicture = async (req, res, next) => {
    try {
        let fileName = req.params.name;
        let deletePath = '../server/images/' + fileName;

        Picture.deletePictureByName(fileName)
        fs.unlink(deletePath, (err) => {
            console.log("Couldn't Unlink")
            console.log(err)
        })
    } catch (err) {
        console.log(err)
    }
}

//sends the picture that matches the id
exports.getPictureById = async (req, res, next) => {
    try {
        if(req.params.id === 0) res.send(null)
        let [fileName, _] = await Picture.getPictureById(req.params.id)
        let name = fileName[0].picture
        res.sendFile(name, {root: '../server/images/'})
    } catch (err) {
        res.status(404)
    }
    
}

exports.getPictureNameById = async (req, res, next) => {
    try {
        let [fileName, _] = await Picture.getPictureById(req.params.id)
        let name = fileName[0].picture
        res.status(200).json({name})

    } catch (err) {
        console.log(err)
        res.status(500).json({"name": null})
    }
}