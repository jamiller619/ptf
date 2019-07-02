const express = require('express')
const pg = require('pg')

const server = express()
const PORT = 3000

const conn = 'postgres://postgres:password@localhost:5432/ptf'
const client = new pg.Client(conn)

server.get('/', (req, res) => res.status(200).send('hello world'))

server.listen(PORT, () =>
  console.log(`Server running on port ${PORT}: http://localhost:3000`)
)
