const { Pool, Client } = require('pg')
const EventEmitter = require('events')
const { Random, MersenneTwister19937 } = require('random-js')

const connectionString = process.env.DATABASE_URL
const pool = new Pool({ connectionString })
const client = new Client({ connectionString })

// removes "times_generated" from db objects since it's an
// implementation detail for generating children
const sanitize = node => {
  const { id, name, upper_bound, lower_bound, children_length, children } = node

  return { id, name, upper_bound, lower_bound, children_length, children }
}

// db query helper which:
//  1: Allows routes to more easily adopt async await
//  syntax with proper error handling
//  2: Automatic and proper pool handling for queries
// eslint-disable-next-line max-statements
const query = async (q, p) => {
  const connectedClient = await pool.connect()

  let res = null

  try {
    await connectedClient.query('BEGIN')

    try {
      res = await connectedClient.query(q, p)
      await connectedClient.query('COMMIT')
    } catch (err) {
      await connectedClient.query('ROLLBACK')
      throw err
    }
  } finally {
    connectedClient.release()
  }

  return res
}

// given five distinct properties of a Node, always generate
// the exact same children.
const assignChildren = node => {
  const children = []
  const {
    id,
    upper_bound,
    lower_bound,
    children_length,
    times_generated
  } = node

  const engine = new Random(MersenneTwister19937.seedWithArray([
    id,
    upper_bound,
    lower_bound,
    children_length,
    times_generated
  ]))

  for (let i = 0; i < children_length; i += 1) {
    children.push(engine.integer(lower_bound, upper_bound))
  }

  node.children = children

  return node
}

pool.on('error', err => {
  throw new Error(`Unexpected error on idle client: ${err}`)
})

exports.events = new EventEmitter()

client.connect().then(() => {
  client.on('notification', message => {
    const payload = JSON.parse(message.payload)
    const { data, operation } = payload
    const node = {
      id: Number(data.id),
      name: data.name,
      lower_bound: Number(data.lower_bound),
      upper_bound: Number(data.upper_bound),
      children_length: Number(data.children_length),
      times_generated: Number(data.times_generated)
    }

    exports.events.emit('update', {
      type: operation,
      node: sanitize(assignChildren(node))
    })
  })

  client.query('LISTEN db_notifications')
})

exports.getAll = async () => {
  const res = await query('SELECT * FROM nodes ORDER BY id ASC')

  return res.rows.map(node => sanitize(assignChildren(node)))
}

exports.get = async id => {
  const res = await query('SELECT * FROM nodes WHERE id = $1', [id])

  return sanitize(assignChildren(res.rows[0]))
}

exports.create = async ({
  name,
  upper_bound,
  lower_bound,
  children_length
}) => {
  const res = await query(
    'INSERT INTO nodes (name, upper_bound, lower_bound, children_length, times_generated) VALUES ($1, $2, $3, $4, 1) RETURNING *',
    [name, upper_bound, lower_bound, children_length]
  )

  return sanitize(assignChildren(res.rows[0]))
}

exports.update = async ({
  id,
  name,
  upper_bound,
  lower_bound,
  children_length
}) => {
  const res = await query(
    'UPDATE nodes SET name = $2, upper_bound = $3, lower_bound = $4, children_length = $5, times_generated = times_generated + 1 WHERE id = $1 RETURNING *',
    [id, name, upper_bound, lower_bound, children_length]
  )

  return sanitize(assignChildren(res.rows[0]))
}

exports.remove = async id => {
  await query('DELETE FROM nodes WHERE id = $1', [id])
}
