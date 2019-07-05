const express = require('express')
const bodyParser = require('body-parser')

const model = require('./model')

const app = express()
const jsonParser = bodyParser.json()

const PORT = process.env.PORT || 3000

app.get('/', (req, res) => res.status(200).send('Hello!'))

/**
 * Get all factory nodes
 */
app.get('/factory-nodes', async (req, res) => {
  try {
    const result = await model.getAll()

    res.status(200).json(result)
  } catch (e) {
    res.status(400).json(e)
  }
})

/**
 * Create a factory nodes
 */
app.post('/factory-node', jsonParser, async (req, res) => {
  try {
    const node = req.body

    // Add verification
    const id = await model.create(node)

    res.status(200).json({ id })
  } catch (e) {
    res.status(400).json(e)
  }
})

/**
 * Update a factory node
 */
app.put('/factory-node', jsonParser, async (req, res) => {
  try {
    const node = req.body

    // Add verification
    const id = await model.update(node)

    res.status(200).json({ id })
  } catch (e) {
    res.status(400).json(e)
  }
})

/**
 * Delete a factory node
 */
app.put('/factory-node', jsonParser, async (req, res) => {
  try {
    const { id } = req.body

    // Add verification
    const result = await model.remove(id)

    res.status(200).json({ result })
  } catch (e) {
    res.status(400).json(e)
  }
})

app.listen(PORT, () =>
  console.log(`app running on port ${PORT}: http://localhost:3000`)
)
