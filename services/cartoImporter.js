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
  console.log(geocodedCsvString)
  const fileOutPath = path.join(os.homedir(), 'geometric_' + userId + '_geocoded.csv')
  fs.writeFileSync(fileOutPath, geocodedCsvString)
  return fileOutPath
}

/**
 * using axios and SQL COPY carto API
 * https://carto.com/developers/sql-api/guides/copy-queries/
 * @param {string} createTableQuery the query to use
 */
async function executeCopy (copyTableQuery, createTableQuery, filename) {
  // this function will call the carto sql api to execute the COPY operation
  const cartoSql = new CartoSqlApi()
  const cartoRes = await cartoSql.copyQueryCarto(copyTableQuery, createTableQuery, filename)
  return cartoRes
}
/**
 * get existing items ids in carto user table
 * @param {string} query
 * @returns {Array} array of customer ids
 */
async function getExistingItems (userName, idColumn) {
  const cartoSql = new CartoSqlApi()
  const existingItemsQuery = queryBuilder.getExistingItemsQuery(userName, idColumn)
  const existingItems = await cartoSql.selectExisting(existingItemsQuery)
  const existingArr = existingItems.map(item => item[idColumn])
  return existingArr
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
    const existingIds = await getExistingItems(userName, idColumn)
    const updatedItems = items.filter(item => existingIds.includes(item[idColumn]))
    const newItems = items.filter(item => !existingIds.includes(item[idColumn]))
    console.log({ updatedItems })
    console.log({ newItems })
    // ^^ everything above this line works
    const insertQueries = updatedItems.map(item => queryBuilder.buildInsertQuery(item))
    // TODO just insert per item OR bulk insert ^^^
    const updateQueries = newItems.map(item => queryBuilder.buildUpdateQuery(item))
    // TODO delete row and insert ^^^
    // todo: function to insert new Items
    // todo: function to update Items
    // todo : return
  }
}