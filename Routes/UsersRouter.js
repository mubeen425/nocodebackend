const express = require('express');
const USersRouter = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../Models/Users');
const multer = require('multer');
const Users = require('../Models/Users');
const cloudinary = require('cloudinary').v2;

const baseUrl = "http://localhost:8082/avatar/avatarImages/";
cloudinary.config({
    secure: true
});
var storage = multer.diskStorage({
    destination: "assets/avatar",
    filename: (req, file, cb) => {
        console.log('upload');
        cb(null, file.originalname)
    }
});
var storage1 = multer.diskStorage({
    destination: "assets/banner",
    filename: (req, file, cb) => {
        console.log('upload');
        cb(null, file.originalname)
    }
});
var uploadAvatar = multer({ storage: storage }).single('image');
var uploadBanner = multer({ storage: storage1 }).single('image');

USersRouter.post('/avatar/uploadImage', uploadAvatar, async (req, res) => {

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
USersRouter.post('/banner/uploadImage', uploadBanner, async (req, res) => {

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

USersRouter.route('/avatar/:fileName')
    .get((req, res, next) => {
        const filename = req.params.fileName;
        console.log("filename", filename, "params", req.params.fileName)
        const directoryPath = "./assets/avatar" + filename;

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

USersRouter.route('/publicpage/:id')
    .post((req, res, next) => {
        const { name, avatar, banner, description, _id } = req.body;
        Users.findByIdAndUpdate(req.params.id, {
            $set: req.body,
        }, { new: true })
            .then(user => res.json(user))
            .catch(err => res.status(400).json({ message: 'An error occured while updating the profile page', error: err }))
    })
USersRouter.post('/signup', (req, res) => {
    const { email, password } = req.body;
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);

    User.create({
        email,
        password: hash
    })
        .then(user => {
            const token = jwt.sign({ id: user._id }, 'secretkey');
            res.json({
                token,
                user: {
                    id: user._id,
                    email: user.email
                }
            });
        })
        .catch(err => res.status(400).json({ message: 'An error occured while creating the user', error: err }))
});

USersRouter.post('/login', async (req, res) => {
    const { email, password } = req.body;

    User.findOne({ email })
        .then(user => {
            if (!user) return res.status(404).json({ message: 'User not found' });

            bcrypt.compare(password, user.password)
                .then(isMatch => {
                    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

                    const token = jwt.sign({ id: user._id }, 'secretkey');
                    res.json({
                        token,
                        user: {
                            id: user._id,
                            email: user.email
                        }
                    });
                })
                .catch(err => res.status(400).json({ message: 'An error occured', error: err }))
        })
        .catch(err => res.status(400).json({ message: 'An error occured', error: err }))
});
USersRouter.post('/logout', (req, res) => {
    res.clearCookie("token").json({
        message: "Successfully logged out"
    });
});

USersRouter.get('/:id',async (req,res,nex)=>{
    console.log("users id", req.params)
    User.findById(req.params.id)
    .then((user)=>res.json(user))
    .catch(err => res.status(400).json({ message: 'An error occured', error: err }))
})
module.exports = USersRouter;
