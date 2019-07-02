const express = require('express')
const { Pool } = require('pg')

const PORT = process.env.PORT || 3000

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: true
})

const app = express()

app.get('/', (req, res) => res.status(200).send('hello world'))

app.get('/ping', async (req, res) => {
  try {
    const client = await pool.connect()
    const result = client.query('SELECT * from nodes')
    const results = {
      results: result && result.rows
    }

    res.send({
      environment: process.env.NODE_ENV,
      results
    })

    client.release()
  } catch (err) {
    console.error(err)
    res.send(err.toString ? err.toString() : 'Unknown error')
  }
})

app.listen(PORT, () =>
  console.log(`app running on port ${PORT}: http://localhost:3000`)
)
