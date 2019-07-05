const { Pool } = require('pg')
const { Random, MersenneTwister19937 } = require('random-js')

exports.getAll = () => {
  return new Promise(resolve => {
    pool.query('SELECT * FROM nodes', (err, res) => {
      if (err) {
        throw err
      }

      resolve(res.rows.map(node => sanitize(assignChildren(node))))
    })
  })
}

exports.get = async id => {
  pool.query('SELECT * FROM nodes WHERE id = $1', [id], (err, res) => {
    if (err) {
      throw err
    }

    return assignChildren(res.rows[0])
  })
}

exports.create = ({ name, upper_bound, lower_bound, children_length }) => {
  return new Promise(resolve => {
    pool.query(
      'INSERT INTO nodes (name, upper_bound, lower_bound, children_length) VALUES ($1, $2, $3, $4) RETURNING id',
      [name, upper_bound, lower_bound, children_length],
      (err, res) => {
        if (err) throw err

        const node = {
          id: res.rows[0].id,
          name,
          upper_bound,
          lower_bound,
          children_length,
          times_generated: 1
        }

        resolve(assignChildren(node))
      }
    )
  })
}

exports.update = ({ id, name, upper_bound, lower_bound, children_length }) => {
  return new Promise((resolve, reject) => {
    pool.query(
      'INSERT INTO nodes (name, upper_bound, lower_bound, children_length) VALUES ($2, $3, $4, $5) WHERE id = $1 RETURNING times_generated',
      [id, name, upper_bound, lower_bound, children_length],
      (err, res) => {
        if (err) reject(err)

        const node = {
          id,
          name,
          upper_bound,
          lower_bound,
          children_length,
          times_generated: res.rows[0].times_generated
        }

        resolve(assignChildren(node))
      }
    )
  })
}

exports.remove = async id => {
  return pool.query('DELETE FROM nodes WHERE id = $1', [id], (err, res) => {
    if (err) {
      throw err
    }

    return true
  })
}

const assignChildren = node => {
  const children = []
  const {
    id,
    upper_bound,
    lower_bound,
    children_length,
    times_generated
  } = node

  const engine = new Random(
    MersenneTwister19937.seedWithArray([
      id,
      upper_bound,
      lower_bound,
      children_length,
      times_generated
    ])
  )

  for (let i = 0; i < children_length; i++) {
    children.push(engine.integer(lower_bound, upper_bound))
  }

  node.children = children

  return node
}

const sanitize = node => {
  const { id, upper_bound, lower_bound, children_length, children } = node

  return { id, upper_bound, lower_bound, children_length, children }
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
})

pool.on('error', err => {
  console.error(`Unexpected error on idle client: ${err}`)
  process.exit(-1)
})
