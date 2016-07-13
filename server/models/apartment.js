/* eslint-disable no-use-before-define, func-names no-underscore-dangle*/

import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const schema = new Schema({
  name: { type: String, validate: { validator: duplicateApartmentNameValidator } },
  sqft: { type: Number, min: 500, max: 2500 },
  rooms: { type: Number, min: 1, max: 4 },
  rent: { type: Number, min: 1000 },
  deposit: { type: Number, min: 50 },
  collectedRent: { type: Number, min: 0 },
  rentDue: { type: Number },
  lateFee: { type: Number, min: 10 },
  renter: { type: Object },
  leaseEnd: { type: Date, validate: { validator: leaseDateValidator } },
  dateCreated: { type: Date, default: Date.now },
});

function duplicateApartmentNameValidator(name, cb) {
  this.model('Apartment').find({ name }, (err, apartments) => {
    cb(!apartments.length);
  });
}

function leaseDateValidator(leasedate) {
  const ldate = new Date(leasedate);
  return (ldate >= Date.now());
}

schema.methods.lease = function (renter, cb) {
  this.renter = renter._id;
  renter.apartment = this._id;
  renter.money -= this.deposit;
  // cb(renter.money);
  this.save((err) => {
    this.save((err1, renter1) => {
        cb(renter1.money);
    });
  });
};
module.exports = mongoose.model('Apartment', schema);
