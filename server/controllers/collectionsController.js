const Collection = require('../models/collections');
const UpdateAndDelete = require('../models/updateAndDelete')

exports.getAllCollections = async (req, res, next) => {
    try {
        let [allCollections, _] = await Collection.getAllCollections();
        res.status(200).json(allCollections);
    } catch (err) {
        console.log(err)
        res.status(500)
    }
}

exports.createNewCollection = async (req, res, next) => {
    let collection;
    try {
        const { name, description, picture } = req.body
        collection = new Collection(name, description, picture);
        collection.save();
        res.status(200).json({"collectionCreated": true});
    } catch (err) {
        console.log(err)
        res.status(500).json({"collectionCreated": false})
    }
}

exports.getCollectionById = async (req, res, next) => {
    
    try {
        
        let [collection, _] = await Collection.getCollectionById(req.params.id);
        res.status(200).json(collection[0])
    } catch (err) {
        console.log(err)
        res.send({})
    }
}

exports.updateCollectionById = async (req, res, next) => {
    try {
        let { id, name, description, picture } = req.body

        UpdateAndDelete.updateById('collections', `
        name = '${name}',
        description = '${description}',
        picture = ${picture}
        `, id)

        res.status(200).json({'updated': true})
    } catch (err) {
        console.log(err)

        res.status(500).json({'updated': false})
    }
}

exports.deleteCollectionById = async (req, res, next) => {
    try {
        let { id } = req.params
        UpdateAndDelete.deleteById('collections', id)

        res.status(200).json({"deleted": true})
    } catch (err) {
        console.log(err)

        res.status(500).json({"deleted": false})
    }
}
