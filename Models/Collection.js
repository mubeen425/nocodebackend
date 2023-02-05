const { Timestamp } = require('mongodb');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const collectionSchema = new Schema({
    name:{
        type: String,
        // require: true
    },
    image: {
        type: String,
        required: true
    },
    user:{
        type: Schema.Types.ObjectId,
        ref:"Users",
        required: true
    }
},
{
    timestamps: { 
        createDate: 'createdAt',
        updatedAt: 'updatedAt' 
    }
}
);

const collectionSchemas = mongoose.model('collectionSchemas', collectionSchema);

module.exports = collectionSchemas;
