const collectionSchemas = require("../Models/Collection");
const express = require('express');
const CollectionRouter = express.Router();
const multer = require('multer');
var fs = require('fs');
const cloudinary = require('cloudinary').v2;
var path = require('path');

const baseUrl = "http://localhost:8082/collection/collectionImages/";
cloudinary.config({
  secure: true
});
/////////////////////////
// Uploads an image file
/////////////////////////
const uploadImage = async (imagePath) => {

  // Use the uploaded file's name as the asset's public ID and 
  // allow overwriting the asset with new versions
  const options = {
    use_filename: true,
    unique_filename: false,
    overwrite: true,
  };

  try {
    // Upload the image
    const result = await cloudinary.uploader.upload(imagePath, options);
    console.log(result);
    return result.public_id;
  } catch (error) {
    console.error(error);
  }
};
var storage = multer.diskStorage({
  destination: "assets/CollectionImages",
  filename: (req, file, cb) => {
    console.log('upload');
    cb(null, file.originalname)
  }
});

var upload = multer({ storage: storage }).single('image');

CollectionRouter.post('/uploadImage', upload, async (req, res) => {

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

CollectionRouter.route('/collectionImages/:fileName')
  .get((req, res, next) => {
    const filename = req.params.fileName;
    console.log("filename", filename, "params", req.params.fileName)
    const directoryPath = "./assets/CollectionImages" + filename;

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

CollectionRouter.post('/new', upload, (req, res) => {
  const { name, image, user } = req.body;
  collectionSchemas.create({
    name,
    image,
    user
  })
    .then(collection => res.json({ collection }))
    .catch(err => res.status(400).json({ message: 'An error occured while creating the collection', error: err }))
});
CollectionRouter.get("/all", (req, res) => {
  collectionSchemas.find({}).populate("user")
    .then(collection => res.json( collection ))
    .catch(err => res.status(400).json({ message: 'An error occured while getting the collection', error: err }))
})
CollectionRouter.get("/collectionbyuser/:id", (req, res) => {
  collectionSchemas.find({user: req.params.id}).populate("user")
    .then(collection => res.json( collection ))
    .catch(err => res.status(400).json({ message: 'An error occured while getting the collection', error: err }))
})
CollectionRouter.put("/update/:id", (req, res) => {
  collectionSchemas.findByIdAndUpdate(req.params.id, {
    $set: req.body,
}, { new: true })
    .then(collection => res.json( collection ))
    .catch(err => res.status(400).json({ message: 'An error occured while updating the collection', error: err }))
})
CollectionRouter.delete("/delete/:id", (req, res) => {
  collectionSchemas.findByIdAndDelete(req.params.id, {
})
    .then(collection => res.json( collection ))
    .catch(err => res.status(400).json({ message: 'An error occured while deleting the collection', error: err }))
})
module.exports = CollectionRouter;