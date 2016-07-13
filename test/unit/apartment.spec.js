/* eslint-disable no-unused-expressions, func-names */

const expect = require('chai').expect;
const sinon = require('sinon');
const Apartment = require('../../dst/models/apartment');
const Renter = require('../../dst/models/renter');

describe('Apartment', () => {
  beforeEach(() => {
    sinon.stub(Apartment, 'find').yields(null, []);
  });

  afterEach(() => {
    Apartment.find.restore();
  });
  describe('constructor', () => {
    it('should create an Apartment object', (done) => {
      const apartment = new Apartment({ name: 'a1',
                                   sqft: 1000,
                                   rooms: 4,
                                   rent: 2000,
                                   deposit: 100,
                                   collectedRent: 4000,
                                   rentDue: 5,
                                   lateFee: 50,
                                   leaseEnd: '12/31/2016' });
      apartment.validate(err => {
        expect(err).to.be.undefined;
        expect(apartment.name).to.be.equal('a1');
        expect(apartment.rooms).to.be.equal(4);
        expect(apartment._id).to.be.ok;
        expect(apartment.dateCreated).to.be.ok;
        done();
      });
    });
    it('should not create an Apartment object - Apartment Name exists', (done) => {
      Apartment.find.yields(null, [{ name: 'a1' }]);
      const apartment = new Apartment({ name: 'a1',
                                   sqft: 1000,
                                   rooms: 4,
                                   rent: 2000,
                                   deposit: 100,
                                   collectedRent: 4000,
                                   rentDue: 5,
                                   lateFee: 50,
                                   leaseEnd: '12/31/2016' });
      apartment.validate(err => {
        expect(err).to.be.ok;
        sinon.assert.calledWith(Apartment.find, { name: 'a1' });
        done();
      });
    });
    it('should not create an Apartment object - sqft out of range', (done) => {
      const apartment = new Apartment({ name: 'a1',
                                   sqft: 10000,
                                   rooms: 4,
                                   rent: 2000,
                                   deposit: 100,
                                   collectedRent: 4000,
                                   rentDue: 5,
                                   lateFee: 50,
                                   leaseEnd: '12/31/2016' });
      apartment.validate(err => {
        expect(err).to.be.ok;
        done();
      });
    });
    it('should not create an Apartment object - rooms out of range', (done) => {
      const apartment = new Apartment({ name: 'a1',
                                   sqft: 1000,
                                   rooms: 5,
                                   rent: 2000,
                                   deposit: 100,
                                   collectedRent: 4000,
                                   rentDue: 5,
                                   lateFee: 50,
                                   leaseEnd: '12/31/2016' });
      apartment.validate(err => {
        expect(err).to.be.ok;
        done();
      });
    });
    it('should not create an Apartment object - rent is too low', (done) => {
      const apartment = new Apartment({ name: 'a1',
                                   sqft: 1000,
                                   rooms: 4,
                                   rent: 20,
                                   deposit: 100,
                                   collectedRent: 4000,
                                   rentDue: 5,
                                   lateFee: 50,
                                   leaseEnd: '12/31/2016' });
      apartment.validate(err => {
        expect(err).to.be.ok;
        done();
      });
    });
    it('should not create an Apartment object - deposit is too low', (done) => {
      const apartment = new Apartment({ name: 'a1',
                                   sqft: 1000,
                                   rooms: 4,
                                   rent: 2000,
                                   deposit: 10,
                                   collectedRent: 4000,
                                   rentDue: 5,
                                   lateFee: 50,
                                   leaseEnd: '12/31/2016' });
      apartment.validate(err => {
        expect(err).to.be.ok;
        done();
      });
    });
    it('should not create an Apartment object - collected rent is negative', (done) => {
      const apartment = new Apartment({ name: 'a1',
                                   sqft: 1000,
                                   rooms: 4,
                                   rent: 2000,
                                   deposit: 100,
                                   collectedRent: -4000,
                                   rentDue: 5,
                                   lateFee: 50,
                                   leaseEnd: '12/31/2016' });
      apartment.validate(err => {
        expect(err).to.be.ok;
        done();
      });
    });
    it('should not create an Apartment object - late Fee is too low', (done) => {
      const apartment = new Apartment({ name: 'a1',
                                   sqft: 1000,
                                   rooms: 4,
                                   rent: 2000,
                                   deposit: 100,
                                   collectedRent: 4000,
                                   rentDue: 5,
                                   lateFee: 5,
                                   leaseEnd: '12/31/2016' });
      apartment.validate(err => {
        expect(err).to.be.ok;
        done();
      });
    });
    it('should not create an Apartment object - lease end date has already passed', (done) => {
      const apartment = new Apartment({ name: 'a1',
                                   sqft: 1000,
                                   rooms: 4,
                                   rent: 2000,
                                   deposit: 100,
                                   collectedRent: 4000,
                                   rentDue: 5,
                                   lateFee: 50,
                                   leaseEnd: '12/31/2014' });
      apartment.validate(err => {
        expect(err).to.be.ok;
        done();
      });
    });
  });

  describe('#lease', () => {
    it('should link up the models and pay deposit', sinon.test(function (done) {
      const apartment = new Apartment({ name: 'a1',
                                   sqft: 1000,
                                   rooms: 4,
                                   rent: 2000,
                                   deposit: 100,
                                   collectedRent: 4000,
                                   rentDue: 5,
                                   lateFee: 50,
                                   leaseEnd: '12/31/2014' });
      const renter1 = new Renter({ name: 'N',
                                    money: 50000,
                                    complaints: 0 });
      this.stub(apartment, 'save').yields(null);
      this.stub(renter1, 'save').yields(null, { renterMoney: 49900 });
      apartment.lease(renter1, (renterMoney) => {
              // sinon.assert.calledOnce(d.save);
        console.log('renterMoney', renterMoney);
        expect(renterMoney).to.equal(49900);
        done();
      });
    }));
  });
});
