const express = require('express');
const NftRouter = express.Router();
const NftSchema = require('../Models/Nft');
const multer = require('multer');
var fs = require('fs');
const cloudinary = require('cloudinary').v2;
const collectionSchemas = require("../Models/Collection");

var path = require('path');

const baseUrl = "http://localhost:8082/nft/allImages/";
cloudinary.config({
  secure: true
});

/////////////////////////
// Uploads an image file
/////////////////////////

var storage = multer.diskStorage({
  destination: "assets/NftImages",
  filename: (req, file, cb) => {
    cb(null, file.originalname)
  }
});

var upload = multer({ storage: storage }).single('image');

NftRouter.post('/uploadImage', upload, async (req, res) => {
  console.log("image re", req.file)

  // configure cloudinary
  cloudinary.config({
    cloud_name: 'dpsdbu1to',
    api_key: '229547665929249',
    api_secret: 'tlGlP4mZwHR9sSAXfjCQ3rIjGwI'
  });

  // upload image to cloudinary
  cloudinary.uploader.upload(req.file.path, (error, result) => {
    if (error) {
      res.status(500).json({ error });
    } else {
      // return the URL of the uploaded image
      res.status(200).json({ url: result.secure_url });
    }
  });
})

NftRouter.route('/allImages/:fileName')
  .get((req, res, next) => {
    const filename = req.params.fileName;
    console.log("filename", filename, "params", req.params.fileName)
    const directoryPath = "./assets/" + filename;

    fs.readFile(directoryPath, function (err, file) {
      if (err) {
        res.status(500).send({
          message: "Unable to scan files!" + err,
        });
      }

      res.status(200).send(file);
    });
  }
  );
NftRouter.post('/new', upload, async (req, res) => {
  const { coll, price, quantity, image } = req.body;
  const rarity = req.body.rarity;
  console.log("new nft", req.body)
  let nft = new NftSchema({ coll, price, quantity, image, rarity })
  console.log("new nft", nft)


  NftSchema.create({
    coll,
    price,
    quantity,
    image,
    rarity
  })
    .then((nft)=> res.json(nft))
      .catch(err => res.status(400).json({ message: 'An error occured while creating the collection', error: err }))

});
NftRouter.route('/getImage/:fileName')
  .get((req, res, next) => {
    const filename = req.params.fileName;
    const directoryPath = "./assets/" + filename;

    fs.readFile(directoryPath, function (err, file) {
      if (err) {
        res.status(500).send({
          message: "Unable to scan files!",
        });
      }

      res.status(200).send(file);
    });
  })

NftRouter.route("/all").get((req, res, next) => {
  NftSchema.find({}).populate("coll")
    .then((collection) => {
      res.status(200);
      res.json(collection)
    })
    .catch((err) => next(err))
})

NftRouter.get('/:userId', (req, res) => {
  collectionSchemas.find({ user: req.params.userId })
    .populate('user')
    .then(collections => {
      const nftIds = collections.map(c => c._id);
      NftSchema.find({ user: req.params.id }).populate("coll")
      .find({ coll: { $in: nftIds } })
        .then(nfts => res.json(nfts))
        .catch(err => res.status(500).json({ message: err.message }));
    })
    .catch(err => res.status(500).json({ message: err.message }));
});
NftRouter.delete("/delete/:id", (req, res, next) => {
  console.log("id", req.body)
  NftSchema.findByIdAndDelete(req.params.id)
    .then((collection) => {
      res.status(200);
      res.json(collection)
    })
    .catch((err) => next(err))
})
NftRouter.put("/update/:id", (req, res, next) => {
  console.log("update", req.params, req.body)

  NftSchema.findByIdAndUpdate(req.params.id, {
    $set: req.body,
  }, { new: true })
    .then((collection) => {
      console.log('collection', collection);
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.json(collection);

    }, (err) => next(err))
    .catch((err) => next(err));

})
module.exports = NftRouter;