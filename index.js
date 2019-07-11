const express = require('express')
const router = express.Router()
const bodyParser = require('body-parser')
const db = require('./db')

const app = express()
const jsonParser = bodyParser.json()

const PORT = process.env.PORT || 3000

app.use(express.static(`${__dirname}/public/dist/`))

app.use('/api', router)

/**
 * live updates
 */
router.get('/live', (req, res) => {
  db.events.on('update', payload => {
    res.write(`data: ${JSON.stringify(payload)}\n\n`)
  })

  req.socket.setTimeout(Number.MAX_VALUE)

  res.writeHead(200, {
    'connection': 'keep-alive',
    'cache-control': 'no-cache',
    'content-type': 'text/event-stream'
  })

  res.write('retry: 10000\n\n')
})

/**
 * get all factory nodes
 */
router.get('/factory-nodes', async (req, res) => {
  try {
    const result = await db.getAll()

    res.status(200).json(result)
  } catch (e) {
    res.status(400).json(e)
  }
})

/**
 * create a factory nodes
 */
router.post('/factory-node', jsonParser, async (req, res) => {
  try {
    const node = req.body

    // add verification
    const result = await db.create(node)

    res.status(200).json(result)
  } catch (e) {
    res.status(400).json(e)
  }
})

/**
 * update a factory node
 */
router.put('/factory-node', jsonParser, async (req, res) => {
  try {
    const node = req.body

    // add verification
    const result = await db.update(node)

    res.status(200).json(result)
  } catch (e) {
    res.status(400).json(e)
  }
})

/**
 * delete a factory node
 */
router.delete('/factory-node', jsonParser, async (req, res) => {
  try {
    const { id } = req.body

    // add verification
    await db.remove(id)

    res.status(200).json(JSON.parse(id))
  } catch (e) {
    res.status(400).json(e)
  }
})

app.listen(PORT, () =>
  console.log(`app running on port ${PORT}: http://localhost:${PORT}`))
