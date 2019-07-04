const express = require('express')
const bodyParser = require('body-parser')
const NodeModel = require('./FactoryNodeModel')

const PORT = process.env.PORT || 3000

const app = express()

// app.use(bodyParser.urlencoded({ extended: false }))
const jsonParser = bodyParser.json()

app.get('/', (req, res) => res.status(200).send('Hello!'))

app.get('/factoryNodes', async (req, res) => {
  try {
    const result = await NodeModel.getAll()

    res.status(200).json(result)
  } catch (e) {
    res.status(400).json(e)
  }
})

app.put('/factoryNode', async (req, res) => {
  try {
    const factoryNode = req.body

    // Add verification

    res.status(200).json(factoryNode.id)
  } catch (e) {
    res.status(400).json(e)
  }
})

app.post('/factoryNode', jsonParser, async (req, res) => {
  try {
    const node = req.body

    console.log(req.body)

    // Add verification
    const id = await NodeModel.create(node)

    res.status(200).json({ id })
  } catch (e) {
    res.status(400).json(e)
  }
})

app.get('/ping', async (req, res) => {
  try {
    const client = await model.connect()
    const result = await client.query('SELECT 1 + 1')
    const results = result.rows

    res.send({
      environment: process.env.NODE_ENV,
      results
    })

    client.release()
  } catch (e) {
    console.error(e)
    res.send(e.toString ? e.toString() : 'Unknown error')
  }
})

app.listen(PORT, () =>
  console.log(`app running on port ${PORT}: http://localhost:3000`)
)
