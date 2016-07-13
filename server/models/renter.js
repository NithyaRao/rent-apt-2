import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const schema = new Schema({
  name: { type: String, minlength: 2 },
  money: { type: Number, min: 1001 },
  apartment: { type: Object },
  complaints: { type: Number, min: 0, max: 3 },
  dateCreated: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Renter', schema);
