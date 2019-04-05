const cartoImporter = require('./cartoImporter')
const samplesHereRes = require('../testData/sampleHereRes')

/**
 * from an array of objects, geocode addresses and import  into carto
 * @param {Array} userData - a collection of user data objects
 * @param {object} user - user infos (email, uid, name)
 * @param {object} params - some params (type, addressField)
 * @returns {object} informations about imported data
 */
async function importUserData (user) {
  const items = samplesHereRes
  const result = await cartoImporter.importIntoCarto(items, user.uid, true, 'input_customer_id')
  // import in carto // @todo: user and key as params
  // const { user_table_name, columns, columnsInfos } = await cartoImporter.importCsv('geometric_' + user.uid + '_geocoded.csv')

  // // add info about columns for frontend
  // const userColumnsWithTypes = params.type !== 'shopify' && params.type !== 'shopifyApi'
  //   ? formatColumnsInfo(columns, columnsInfos)
  //   : [
  //     { type: 'text', column: 'total_spent', csvColumn: 'Total Spent' },
  //     { type: 'text', column: 'total_orders', csvColumn: 'Total Orders' }
  //   ]

  // return {
  // geocoder: geocoderResult, // disabled because not used for the moment
  // cartoImporter: {
  //   table_name: user_table_name,
  //   columns: userColumnsWithTypes
  // }
  // }
  return 'testy calls'
}
module.exports = {
  importUserData
}
