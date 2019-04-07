require('dotenv').config()
const axios = require('axios')
const formData = require('form-data')
const fs = require('fs')

module.exports = class CartoSql {
  constructor () {
    this.apiKey = process.env.CARTO_DB_KEY
    this.apiUser = process.env.CARTO_DB_USER
    this.createUrl = `https://${this.apiUser}.carto.com/api/v2/sql` 
    this.copyUrl = `https://${this.apiUser}.carto.com/api/v2/sql/copyfrom`
    this.basicAuth = 'Basic ' + Buffer.from(this.apiUser + ':' + this.apiKey).toString('base64')
  }

  async queryCarto (copyQuery, createQuery, filePath) {
    console.log(createQuery)
    const fileArr = filePath.split('/')
    const fileName = fileArr[fileArr.length - 1]
    // let data = new formData()
    // data.append('file', fs.createReadStream(filePath))
    console.log({createQuery})
    console.log({copyQuery})
    const data = fs.createReadStream(filePath)
    const createParams = { 'q': createQuery }
    const createHeaders = { Authorization: this.basicAuth }
    const copyParams = { 'q': copyQuery }
    const copyHeaders = {
      Authorization: this.basicAuth,
      accept: 'application/json',
      'Transfer-Encoding': 'chunked',
      'Content-Type': 'application/octet-stream'
      // 'Accept-Language': 'en-US,en;q=0.8',
      // 'Content-Type': `multipart/form-data; boundary=${data._boundary}`,
    }
    const deleteParams = { 'q': `DROP TABLE anagraph_dev_import` }
    const cartoParams = { 'q': `SELECT cdb_cartodbfytable('anagraph-clement', 'anagraph_dev_import');`}
    // create
    try {
      // delete table if exists for now
      await axios.post(this.createUrl, null, { params: deleteParams, headers: createHeaders })
      // now create a new empty table
      await axios.post(this.createUrl, null, { params: createParams, headers: createHeaders })
      // now we make that empty table a carto dataset
      await axios.get(this.createUrl, { params: cartoParams, headers: createHeaders })

      console.log('Empty table created, check carto datasets')
      // return
    } catch (err) {
      console.error(err)
    }
    // copy 
    try {
      const cartoApiRespnse = await axios.post(this.copyUrl, data, { params: copyParams, headers: copyHeaders })
      console.log(cartoApiRespnse)
      return cartoApiRespnse
    } catch (err) {
      console.error(err)
    }
  }
}
