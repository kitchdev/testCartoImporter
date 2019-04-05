require('dotenv').config()
const axios = require('axios')
const formData = require('form-data')

module.exports = class CartoSql {
  constructor () {
    this.apiKey = process.env.CARTO_DB_KEY
    this.apiUser = process.env.CARTO_DB_USER
    this.createUrl = `https://${this.apiUser}.carto.com/api/v2/sql` 
    this.copyUrl = `https://${this.apiUser}.carto.com/api/v2/sql/copyfrom`
    this.basicAuth = 'Basic ' + Buffer.from(this.apiUser + ':' + this.apiKey).toString('base64')
  }

  async queryCarto (createQuery, copyQuery, filePath) {
    console.log(createQuery)
    const fileArr = filePath.split('/')
    const fileName = fileArr[fileArr.length - 1]
    let data = new formData()
    data.append('file', filePath, fileName)
    console.log({createQuery})
    console.log({copyQuery})
    const createParams = { 'q': createQuery }
    const createHeaders = { Authorization: this.basicAuth }
    const copyParams = { 'q': copyQuery }
    const copyHeaders = {
      Authorization: this.basicAuth,
      accept: 'application/json',
      'Accept-Language': 'en-US,en;q=0.8',
      'Content-Type': `multipart/form-data; boundary=${data._boundary}`,
    }
    // create
    try {
      await axios.post(this.createUrl, null, { params: createParams, headers: createHeaders })
      console.log('Empty table created')
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
