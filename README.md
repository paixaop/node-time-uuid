# node-time-uuid

Node module to generate globally unique, time sortable indentifiers that can be used
as database unique IDs.
The identifiers are time sortable and you can recover the time stamp of when they
were created down to micro-second resolution.
Time sortable identifiers can very useful in situations where you want to sort
your objects by time, for instance messages in a user's inbox.

The generated IDs are not standard UUID, or GUID and are generated with the
following format:

  * 32 bit time
  * 16 bit micro time
  * 24 bit machine id
  * 16 bit pid
  * 24 bit increment

And are stored internally as a node buffer.

## Install

Simple installation with NPM

    npm install node-time-uuid


## Usage

    var ObjectId = require("node-time-uuid");

    var id = new ObjectId();

    // get date from Id
    var date = id.getDate();

    // get timestamp from Id
    var timestamp =  id.getTimestamp();

    // get timestamp and microsecond time
    var [timestamp, microseconds] = id.getTimeOfDay();

## API

## New Instance
ObjectId can be instanciated in several different ways:

    var ObjectId = require("node-time-uuid");

    // Create a new ID
    var id = new ObjectId();

    // Create an Object Id instance from existing Id encoded as a Hex string
    var id = new ObjectId("512055ac09b8979d8fa1511f000002");

    // Create an Object Id instance from existing Id encoded as base64 string
    var id = new ObjectId("USBVrAm4l52PoVEfAAAC");

    // Create an Object Id instance from existing Node buffer
    var id = new ObjectId(buffer);

Supported encodings are hex, base64 and base64url

## get()

Returns a 15 byte Node.js Buffer object with the Id.

    var buffer = id.get();

## toString(encoding)

Returns a string representation of ObjectId, according to the specified enconding.
Supported encodings are hex, base64, base64url, pretty.

  * hex: 512055ac09b8979d8fa1511f000002
  * base64: USBVrAm4l52PoVEfAAAC
  * base64url: USBVrAm4l52PoVEfAAA-
  * pretty: 512055ac-09b897-9d8fa1-511f-000002

## getTimestamp()

Get the unix timestamp from the ObjectId

    var timestamp =  id.getTimestamp();

## getTimeOfDay()

Get timestamp of the ObjectId in seconds and microseconds

    var [timestamp, microseconds] = id.getTimeOfDay();

## getDate()

Return Javascript Date() object from the ObjectId.

# Testing
Tests require Node mocha and istanbul modules to be installed .

    npm install mocha istanbul -g

Tests need to connect to a Redis server. By default it tries to connect to localhost:6376.
So you must have a running Redis server or the tests will fail.

To run all module tests simply run:

    npm test

or

    make test

To obtain a test coverage report run

    npm cover

#License

MIT License
