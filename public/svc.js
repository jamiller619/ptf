const HOST = '/api'

const request = async (url, data, opts) => {
  try {
    const response = await fetch(`${HOST}${url}`, {
      headers: {
        'Content-Type': 'application/json'
      },
      body: data,
      ...opts
    })

    return response.json()
  } catch (err) {
    console.error(err)

    return err
  }
}

export const liveEvents = new EventSource(`${HOST}/live`)

export const getAllNodes = () => {
  return request('/factory-nodes')
}

export const saveNode = node => {
  return request('/factory-node', JSON.stringify(node), {
    method: node.id ? 'PUT' : 'POST'
  })
}

export const deleteNode = id => {
  return request('/factory-node', JSON.stringify({ id }), {
    method: 'DELETE'
  })
}
