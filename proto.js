const protobuf = require('protobufjs');
const path = require('path');

const p = path.resolve('./YPricingData.proto');

const root = protobuf.loadSync(p);

const Yaticker = root.lookupType("yaticker");

module.exports = {
  Yaticker,
}