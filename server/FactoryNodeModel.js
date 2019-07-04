const { Pool } = require('pg')

exports.getAll = () => {
  return new Promise(resolve => {
    pool.query('SELECT * FROM nodes', (err, res) => {
      if (err) {
        throw err
      }

      resolve(res.rows)
    })
  })
}

exports.get = async id => {
  pool.query('SELECT * FROM nodes WHERE id = $1', [id], (err, res) => {
    if (err) {
      throw err
    }

    return res.rows[0]
  })
}

exports.create = ({ name, upperBound, lowerBound, childrenLength }) => {
  return new Promise(resolve => {
    pool.query(
      'INSERT INTO nodes (name, upper_bound, lower_bound, children_length) VALUES ($1, $2, $3, $4) RETURNING id',
      [name, upperBound, lowerBound, childrenLength],
      (err, res) => {
        if (err) throw err

        resolve(res.rows[0].id)
      }
    )
  })
}

exports.update = async ({
  id,
  name,
  upperBound,
  lowerBound,
  childrenLength
}) => {
  return pool.query(
    'INSERT INTO nodes (name, upper_bound, lower_bound, children_length) VALUES ($2, $3, $4, $5) WHERE id = $1',
    [id, name, upperBound, lowerBound, childrenLength],
    (err, res) => {
      if (err) throw err

      return true
    }
  )
}

exports.remove = async id => {
  return pool.query('DELETE FROM nodes WHERE id = $1', [id], (err, res) => {
    if (err) {
      throw err
    }

    return true
  })
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
})

pool.on('error', err => {
  console.error(`Unexpected error on idle client: ${err}`)
  process.exit(-1)
})
