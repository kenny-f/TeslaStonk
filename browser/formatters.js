const numberFormat = Intl.NumberFormat('en-US').format;
const currencyFormat = Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format;
const rangeFormat = (str) => str.split('-').filter(Boolean).map(n => currencyFormat(Number(n))).join('-');

module.exports = {
  numberFormat,
  currencyFormat,
  rangeFormat,
}