const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const rarity = new Schema({
    key: {type:String},
    value: {type: String}
})
const nftSchema = new Schema({
    coll: {
        type: Schema.Types.ObjectId,
        ref:"collectionSchemas"
    },
    price: {
        type: Number,
    },
    quantity: {
        type: Number,
    },
    image: {
        type: String,
    },
    rarity: [rarity],
    
},{
    timestamps: { 
        createDate: 'createdAt',
        updatedAt: 'updatedAt' 
    }
});

const NftSchema = mongoose.model('NftSchema', nftSchema);

module.exports = NftSchema;
