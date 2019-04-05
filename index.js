const express = require('express')
const app = express()
const port = 4001

const importer = require('./services/import')

app.get('/', async (req, res) => {
  const user = { uid: 'shopify:anagraph_dev' }
  const cartores = await importer.importUserData(user)
  res.send(cartores)
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
