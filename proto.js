const protobuf = require('protobufjs');
const yahooTicker = require('./yahooTicker.json');

const root = protobuf.Root.fromJSON(yahooTicker);

const Yaticker = root.lookupType("yaticker");

module.exports = {
  Yaticker,
}