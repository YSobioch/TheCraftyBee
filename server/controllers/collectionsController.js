const Collection = require('../models/collections');

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
        const { name, description, picture } = req.body.params
        collection = new Collection(name, description, picture);
        collection.save();
        res.status(200).send('collection created');
    } catch (err) {
        console.log(err)
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
