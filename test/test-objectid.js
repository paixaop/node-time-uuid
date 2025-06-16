/*
 * Burn Notice Test ObjectID
 * Pedro Paixao
 * 1/20/2013
 *
 * $Id: test-objectid.js 770 2013-02-21 03:06:56Z pedro $
 */

var should = require('should');
var ObjectId = require('../../node-time-uuid');

//512055ac-09b897-9d8fa1-511f-000002
//USBVrAm4l52PoVEfAAAC
describe('Test ObjectId()', function() {
    it('should return a valid object id', function(done){
        var id = new ObjectId();
        done();
    });

    it('should convert a hex string to a valid Id', function(done){
        var id = new ObjectId("512055ac09b8979d8fa1511f000002");
        id.toString('hex').should.be.eql("512055ac09b8979d8fa1511f000002");
        id.toString().should.be.eql("512055ac09b8979d8fa1511f000002");
        done();
    });

    it('tostring() should return a hex', function(done){
        var id = new ObjectId("512055ac09b8979d8fa1511f000002");
        id.toString().should.be.eql("512055ac09b8979d8fa1511f000002");
        done();
    });


    it('should convert a base64 string to a valid Id', function(done){
        var id = new ObjectId("USBVrAm4l52PoVEfAAAC");
        id.toString('hex').should.be.eql("512055ac09b8979d8fa1511f000002");
        id.toString('base64').should.be.eql("USBVrAm4l52PoVEfAAAC");
        done();
    });

    it('should convert a base64 string to a valid Id', function(done){
        var id = new ObjectId("USBVrAm4l52PoVEfAAA+");
        id.toString('hex').should.be.eql("512055ac09b8979d8fa1511f00003e");

        // Test Base64url
        id.toString('base64url').should.be.eql("USBVrAm4l52PoVEfAAA-");

        // Test Base64
        id.toString('base64').should.be.eql("USBVrAm4l52PoVEfAAA+");
        done();
    });

    it('should convert a base64url string to a valid Id', function(done){
        var id = new ObjectId("USBVrAm4l52PoVEfAAA_");
        id.toString('hex').should.be.eql("512055ac09b8979d8fa1511f00003f");

        // Test Base64url
        id.toString('base64url').should.be.eql("USBVrAm4l52PoVEfAAA_");

        // Test Base64
        id.toString('base64').should.be.eql("USBVrAm4l52PoVEfAAA/");
        done();
    });

    it('should throw on a bad encoding on toString()', function(done){
        var id = new ObjectId("USBVrAm4l52PoVEfAAA_");

        (function() {
            id.toString('hexo');
        }).should.throw();
        done();
    });


    it('should convert an id to a timestamp', function(done){
        var id = new ObjectId("512055ac09b8979d8fa1511f000002");
        id.getTimestamp().should.be.eql(1361073580);
        done();
    });

    it('should return a pretty id string', function(done){
        var id = new ObjectId("512055ac09b8979d8fa1511f000002");
        id.toString('pretty').should.be.eql("512055ac-09b897-9d8fa1-511f-000002");
        done();
    });

    it('should convert an id to a timestamp with micro-seconds', function(done){
        var id = new ObjectId("512055ac09b8979d8fa1511f000002");
        var timestamp = id.getTimeOfDay();
        timestamp.should.be.an.instanceof(Array);
        timestamp[0].should.be.eql(1361073580);
        timestamp[1].should.be.eql(637079);
        done();
    });

    it('getDate should be a Date object', function(done){
        var id = new ObjectId("512055ac09b8979d8fa1511f000002");
        var delta = id.getDate() - new Date(1361073580000);
        delta.should.be.eql(0);
        done();
    });

    it('should accept a buffer object', function(done){
        var id = new ObjectId(new Buffer([
            0x51,
            0x20,
            0x55,
            0xac,
            0x09,
            0xb8,
            0x97,
            0x9d,
            0x8f,
            0xa1,
            0x51,
            0x1f,
            0x00,
            0x00,
            0x02])
        );
        id.toString('base64').should.be.eql("USBVrAm4l52PoVEfAAAC");
        done();
    });

    it('should fail on bad param', function(done){
        (function() {
            var id = new ObjectId(512055);
        }).should.throw();
        done();
    });

    it('should fail on bad hex string', function(done){
        (function() {
            var id = new ObjectId("512055ac09b89");
        }).should.throw();
        done();
    });

    it('should fail on bad buffer', function(done){
        (function() {
            var id = new ObjectId(new Buffer([
                0x51,
                0x20,
                0x55,
                0xac,
                0x09,
                0x8f,
                0xa1,
                0x51,
                0x1f,
                0x00,
                0x00,
                0x02])
            );
        }).should.throw();
        done();
    });

});
