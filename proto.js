const protobuf = require('protobufjs');

const root = protobuf.loadSync('./YPricingData.proto');

const Yaticker = root.lookupType("yaticker");

module.exports = {
  Yaticker,
}