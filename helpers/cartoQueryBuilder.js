const fs = require('fs')
const fieldsTypes = require('../testData/createFieldsTypes')
/**
 * create query for COPY SQL statement
 * @param {string} filename name of the import file
 * @returns {string} the sql query
 */
function createTableQuery (filePath, username) {
  // here we'll construct a query to create an empty table with the necessary fields
  const fileContexts = fs.readFileSync(filePath, { encoding: 'utf8' })
  const headerLine = fileContexts.split('\n')[0]
  const tableName = `${username}_import`
  const queryCreate = `CREATE TABLE ${tableName} (${fieldsTypes})`
  const queryCopy = `COPY ${tableName} (${headerLine}) FROM stdin WITH (FORMAT csv,HEADER true);`
  return  { queryCreate, queryCopy }
}

/**
 * create query for getting existing items in user carto table
 * @param {string} userId
 * @returns {string} the sql query
 */
function getExistingItemsQuery (userId) {
  // here we'll construct a query to extract customer id's that we recieved from the most recent
  // shopify sync- given that the table already exists...

}

function buildInsertQuery (newItems) {
  // here we'll construct a query to insert new rows into the existing table
}

function buildUpdateQuery (updateItems) {
  // here we'll construct a query to update row in the existing table
}

module.exports = {
  createTableQuery,
  getExistingItemsQuery,
  buildInsertQuery,
  buildUpdateQuery
}
