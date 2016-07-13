/* eslint-disable no-unused-expressions, func-names */

const expect = require('chai').expect;
const Renter = require('../../dst/models/renter');


describe('Renter', () => {
  describe('constructor', () => {
    it('should create a Renter object', (done) => {
      const renter1 = new Renter({ name: 'Nithya',
                                   money: 500000,
                                   complaints: 0 });
      renter1.validate(err => {
        expect(err).to.be.undefined;
        expect(renter1.name).to.be.equal('Nithya');
        expect(renter1._id).to.be.ok;
        expect(renter1.dateCreated).to.be.ok;
        done();
      });
    });
    it('should not create a Renter object - Name min length 2', (done) => {
      const renter1 = new Renter({ name: 'N',
                                   money: 500000,
                                   complaints: 0 });
      renter1.validate(err => {
        expect(err).to.be.ok;
        done();
      });
    });
    it('should not create a Renter object - Money is less than 1001', (done) => {
      const renter1 = new Renter({ name: 'Nithya',
                                   money: 5,
                                   complaints: 0 });
      renter1.validate(err => {
        expect(err).to.be.ok;
        done();
      });
    });
    it('should not create a Renter object - complaint not between 0 and 3', (done) => {
      const renter1 = new Renter({ name: 'Nithya',
                                   money: 50000,
                                   complaints: 4 });
      renter1.validate(err => {
        expect(err).to.be.ok;
        done();
      });
    });
  });
});
