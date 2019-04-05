const Papa = require('papaparse')
const path = require('path')
const os = require('os')
const fs = require('fs')

const CartoSqlApi = require('../api/cartoSqlApi')

const queryBuilder = require('../helpers/cartoQueryBuilder')
/**
 * create temporary (CSV or JSON ?) file from items for COPY
 * @param items
 * @returns filename name of the file
*/
function createSQLCopyFile (items, userId) {
  // this is where we'll create the csv file needed for COPY operation
  const geocodedCsvString = Papa.unparse(items)
  const fileOutPath = path.join(os.tmpdir(), 'geometric_' + userId + '_geocoded.csv')
  fs.writeFileSync(fileOutPath, geocodedCsvString)
  return fileOutPath
}

/**
 * using axios and SQL COPY carto API
 * https://carto.com/developers/sql-api/guides/copy-queries/
 * @param {string} createTableQuery the query to use
 */
async function executeCopy (createTableQuery, copyTableQuery, filename) {
  // this function will call the carto sql api to execute the COPY operation
  const cartoSql = new CartoSqlApi()
  const cartoRes = await cartoSql.queryCarto(createTableQuery, copyTableQuery, filename)
  return cartoRes
}
/**
 * get existing items ids in carto user table
 * @param {string} query
 * @returns {Array} array of customer ids
 */
function getExistingItems (userId, idColumn) {
  const existingItemsQuery = queryBuilder.getExistingItemsQuery(userId)
  // ...
}

/**
 *  Import items into carto
 *  @param {Array} items array of objects with key and string values
 *  @param {Boolean} isFirstImport whether first import or not
 *  @returns todo: documentation
 */
exports.importIntoCarto = async function (items, userId, isFirstImport, idColumn) {
  // stripping shopify prefix
  const userName = userId.split(':')[1]
  if (isFirstImport) {
    const filePath = createSQLCopyFile(items, userName)
    const { queryCopy, queryCreate } = queryBuilder.createTableQuery(filePath, userName)
    console.log(queryCopy)
    const result = await executeCopy(queryCopy, queryCreate, filePath)
    return result
    // return ...
  } else {
    const existingIds = getExistingItems(userId, idColumn)
    const updatedItems = items.filter(item => existingIds.includes(item[idColumn]))
    const newItems = items.filter(item => !existingIds.includes(item[idColumn]))
    // const insertQuery = queryBuilder.buildInsertQuery(newItems)
    // const updateQuery = queryBuilder.buildUpdateQuery(updateItems)
    // todo: function to insert new Items
    // todo: function to update Items
    // todo : return
  }
}