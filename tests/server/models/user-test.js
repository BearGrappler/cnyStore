var sinon = require('sinon');
var expect = require('chai').expect;

var Sequelize = require('sequelize');

var db = require('../../../server/db');

var User = db.model('User');

describe('User model', function () {

    beforeEach('Sync DB', function () {
       return db.sync({ force: true });
    });

    describe('password encryption', function () {

        describe('generateSalt method', function () {

            it('should exist', function () {
                expect(User.generateSalt).to.be.a('function');
            });

            it('should return a random string basically', function () {
                expect(User.generateSalt()).to.be.a('string');
            });

        });

        describe('encryptPassword', function () {

            var cryptoStub;
            var hashUpdateSpy;
            var hashDigestStub;
            beforeEach(function () {

                cryptoStub = sinon.stub(require('crypto'), 'createHash');

                hashUpdateSpy = sinon.spy();
                hashDigestStub = sinon.stub();

                cryptoStub.returns({
                    update: hashUpdateSpy,
                    digest: hashDigestStub
                });

            });

            afterEach(function () {
                cryptoStub.restore();
            });

            it('should exist', function () {
                expect(User.encryptPassword).to.be.a('function');
            });

            it('should call crypto.createHash with "sha1"', function () {
                User.encryptPassword('asldkjf', '066cd2b95fd9663538b58899da88117d45dc39ad893ebda6c8b28da0fdd13616772097e4dc9cce2928fa0dc8cd1ff0de6fe5ece561f2956f8c07105de09b7098');
                expect(cryptoStub.calledWith('sha512')).to.be.ok;
            });

            it('should call hash.update with the first and second argument', function () {

                var pass = 'testing';
                var salt = '1093jf10j23ej===12j';

                User.encryptPassword(pass, salt);

                expect(hashUpdateSpy.getCall(0).args[0]).to.be.equal(pass);
                expect(hashUpdateSpy.getCall(1).args[0]).to.be.equal(salt);

            });

            it('should call hash.digest with hex and return the result', function () {

                var x = {};
                hashDigestStub.returns(x);

                var e = User.encryptPassword('sdlkfj', 'asldkjflksf');

                expect(hashDigestStub.calledWith('hex')).to.be.ok;
                expect(e).to.be.equal(x);

            });

        });

        describe('on creation', function () {

            var encryptSpy;
            var saltSpy;

            var createUser = function () {
                return User.create({ email: 'obama@gmail.com', password: 'potus' });
            };

            beforeEach(function () {
                encryptSpy = sinon.spy(User, 'encryptPassword');
                saltSpy = sinon.spy(User, 'generateSalt');
            });

            afterEach(function () {
                encryptSpy.restore();
                saltSpy.restore();
            });

            it('should call User.encryptPassword with the given password and generated salt', function (done) {
                createUser().then(function () {
                    var generatedSalt = saltSpy.getCall(0).returnValue;
                    expect(encryptSpy.calledWith('potus', generatedSalt)).to.be.ok;
                    done();
                });
            });

            it('should set user.salt to the generated salt', function (done) {
               createUser().then(function (user) {
                   var generatedSalt = saltSpy.getCall(0).returnValue;
                   expect(user.salt).to.be.equal(generatedSalt);
                   done();
               });
            });

            it('should set user.password to the encrypted password', function (done) {
                createUser().then(function (user) {
                    var createdPassword = encryptSpy.getCall(0).returnValue;
                    expect(user.password).to.be.equal(createdPassword);
                    done();
                });
            });

        });

        describe('sanitize method', function () {

            var createUser = function () {
                return User.create({ email: 'obama@gmail.com', password: 'potus' });
            };

            it('should remove sensitive information from a user object', function () {
                createUser().then(function (user) {
                    var sanitizedUser = user.sanitize();
                    expect(user.password).to.be.ok;
                    expect(user.salt).to.be.ok;
                    expect(sanitizedUser.password).to.be.undefined;
                    expect(sanitizedUser.salt).to.be.undefined;
                });
            });
        });

    });

});
