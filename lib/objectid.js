/**
 * Objecet IDs
 *
 * @author Pedro Paixao paixaop@gmail.com
 *
 * @description Time sortable unique IDs that can be used for Object IDs in
 *              databases and such
 *
 * Object Ids are stored as node.js Buffer objects with the following data
 * structure:
 *   32 bit time
 *   16 bit micro time
 *   24 bit machine id
 *   16 bit pid
 *   24 bit increment
 *
 * $Id: objectid.js 754 2013-02-19 23:18:42Z pedro $
 */

var crypto = require('crypto');
var os = require('os');
var microtime = require('microtime');

// Generate machine hash
//  from docs: This is the first three bytes of the (md5) hash of the machine host name, or of the mac/network address,
//     or the virtual machine id.
var machineHash = new Buffer(
     crypto.createHash('md5')
        .update(os.hostname(),'ascii')
        .digest('binary'));

// Cache the machine hash / pid
var machineAndPid = new Buffer([
    machineHash[1],
    machineHash[3],
    machineHash[5],
    (process.pid) & 0xFF,
    (process.pid >> 8) & 0xFF
]);

// ObjectId increment
var inc = 1;

var ObjectId = module.exports = function(bytes) {
    var self = this;

    self.bytes = undefined;

    /**
     * Initialize the object
     *
     * @param bytes {buffer} Node.js buffer object
     * @param bytes {string} hex, base64, or base64url encoded ObjectId string
     * @param bytes optional generate new ObjectId
     *
     */
    self.init = function(bytes) {
        if (Buffer.isBuffer(bytes)) {

            if (bytes.length != 15) {
                throw new Error("Buffer-based ObjectId must be 15 bytes");
            }
            self.bytes = bytes;

        }
        else if (typeof bytes == 'string') {

            // Base64-url encoded string
            var base64UrlStringPattern = new RegExp("^[0-9a-zA-Z_-]{20}$","i");
            if (base64UrlStringPattern.test(bytes)) {
                bytes = bytes.replace(/_/g,'/').replace(/-/g,'+');
                self.bytes = new Buffer(bytes, 'base64');
                return;
            }

            // Base64 encoded string
            var base64StringPattern = new RegExp("^[0-9a-zA-Z/+]{20}$","i");
            if (base64StringPattern.test(bytes)) {
                self.bytes = new Buffer(bytes, 'base64');
                return;
            }

            // Hex encoded string
            var hexStringPattern = new RegExp("^[0-9a-f]{30}$","i");
            if (hexStringPattern.test(bytes)) {
                self.bytes = new Buffer(bytes, 'hex');
                return;
            }

            throw new Error("String-based ObjectId must in hex, base64 or base64url formats.");

        }
        else if (typeof bytes !== 'undefined') {
            throw new Error("Unrecognized bytes type. Must be Buffer or string.");
        }
        else {
            var timestamp = microtime.nowStruct();

            inc = ~~inc + 1; // keep as integer

            self.bytes = new Buffer([
                timestamp[0] >> 24,
                timestamp[0] >> 16,
                timestamp[0] >> 8,
                timestamp[0],
                timestamp[1] >> 16,
                timestamp[1] >> 8,
                timestamp[1],
                machineAndPid[0],
                machineAndPid[1],
                machineAndPid[2],
                machineAndPid[3],
                machineAndPid[4],
                inc >> 16,
                inc >> 8,
                inc
            ]);
        };
    };

    /**
     * @returns {Buffer} Node.js byte buffer object
     */
    self.get = function() {
        return self.bytes;
    }

    /**
     * Convert the ObjectId to a string
     *
     * @param encoding {string} optional hex, base64, base64url
     *
     * If no encoding is given assume hex
     *
     * @returns {string} string ObjectID
     */
    self.toString = function(encoding) {
        if (typeof encoding === 'undefined') {
            return self.bytes.toString('hex');
        }
        switch (encoding) {
            case 'hex':
            case 'base64':
                return self.bytes.toString(encoding);

            case 'pretty':
                var str = self.bytes.toString('hex');

                //512055ac-09b897-9d8fa1-511f-000002
                return str.substring(0,8) + '-'
                     + str.substring(8,14) + '-'
                     + str.substring(14,20) + '-'
                     + str.substring(20,24) + '-'
                     + str.substring(24,str.length);

            case 'base64url':
                return self.bytes.toString('base64').replace(/\//g,'_').replace(/\+/g,'-');
        }

        throw new Error('Unsupported encoding ' + encoding);
    };

    /**
     * Get Unix Timestamp of when the ID was created
     * @returns {Number} timestamp in seconds
     */
    self.getTimestamp = function() {
        return self.bytes.readUInt32BE(0);
    };

    /**
     * Get timestamp of the ID in seconds and microseconds
     * @returns {Array} [seconds, microseconds] sinde Epoc
     * @see gettimeofday from sys/time.h
     */
    self.getTimeOfDay = function() {
        var seconds = self.bytes.readUInt32BE(0);
        var microSeconds = self.bytes.readUInt32BE(3) & 0x00FFFFFF;
        return [seconds, microSeconds];
    };

    /**
     * Get Date object from ID. Each ID contains the timestamp of when it was created.
     * @returns {Date} Date of when the ID was created
     */
    self.getDate = function() {
        var timestamp = self.bytes.readUInt32BE(0);
        return new Date(timestamp * 1000);
    };

    // Now that the object is fully defined call initializer
    self.init(bytes);
};
