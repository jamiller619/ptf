/* eslint-disable no-use-before-define */
import { h, patch } from 'superfine'
import { getAllNodes, saveNode, deleteNode, liveEvents } from './svc'

import styles from '/assets/app.scss'
import logo from '/assets/logo.svg'
import VsLogo from './component/VsLogo'
import Node from './component/Node'
import NodeForm from './component/NodeForm'
import animate from './component/animate'
import getNodeStyle from './component/getNodeStyle'

const root = document.getElementById('root')

const NodesContainer = (props, children) => animate(
  {
    translateX: [-200, 0],
    opacity: [0, 1],
    stagger: 100
  }, (
    <div {...props}>{children}</div>
  )
)

const handleNodeAdd = state => () => {
  const nextNodeId = Math.max(...state.nodes.map(n => n.id)) + 1

  setState({
    ...appState,
    expanded: false,
    showForm: true,
    editNode: {
      style: getNodeStyle(nextNodeId),
      name: `New node name ${nextNodeId}`,
      lower_bound: 1,
      upper_bound: 100,
      children_length: 5
    }
  })
}

const handleNodeClick = (state, node) => e => {
  e.stopPropagation()

  setState({
    ...state,
    expanded: node.id
  })
}

const handleNodeEdit = (state, node) => () => {
  setState({
    ...state,
    showForm: true,
    expanded: false,
    editNode: {
      style: getNodeStyle(node.id),
      ...node
    }
  })
}

const handleNodeDelete = (state, node) => () => {
  deleteNode(node.id)
}

const handleFormCancel = state => () => {
  setState({
    ...state,
    showForm: false
  })
}

const handleFormSubmit = state => e => {
  e.preventDefault()
  const el = e.target.elements
  const node = {
    lower_bound: Number(el.lower_bound.value),
    upper_bound: Number(el.upper_bound.value),
    name: el.name.value,
    children_length: Number(el.children_length.value)
  }

  if (el.id) {
    node.id = Number(el.id.value)
  }

  saveNode(node)

  setState({
    ...state,
    showForm: false
  })
}

const handleBodyClick = state => () => {
  setState({
    ...state,
    expanded: false
  })
}

const App = state => {
  const bodyStyles = [styles.body]

  if (state.showForm === true) {
    bodyStyles.push(styles.blur)
  }

  return (
    <main class={styles.main} onclick={handleBodyClick(state)}>
      <header class={styles.header}>
        <h2 class={styles.heading}>
          <img class={styles.logo} src={logo} /> Passport Tree Factory
        </h2>
        <VsLogo class={styles.vs} />
      </header>
      <NodeForm
        styles={styles}
        display={state.showForm === true}
        node={state.editNode}
        oncancel={handleFormCancel(state)}
        onsubmit={handleFormSubmit(state)}
        style={state.editNode && styles[state.editNode.style]}
      />
      <div class={bodyStyles.join(' ')}>
        <button
          onclick={handleNodeAdd(state)}
          class={styles.rootNode}>
          <span>+</span>
        </button>
        <NodesContainer class={styles.nodesColumn}>{
          state.nodes.map(node => (
            <Node
              {...node}
              key={node.id}
              styles={styles}
              expanded={state.expanded === node.id}
              onclick={handleNodeClick(state, node)}
              onedit={handleNodeEdit(state, node)}
              ondelete={handleNodeDelete(state, node)}
            />
          ))
        }</NodesContainer>
      </div>
    </main>
  )
}

let appState = {}

const app = (view, container, node) => state => {
  appState = state
  // eslint-disable-next-line no-param-reassign
  node = patch(node, view(state || {}), container)
}

const setState = app(App, root)

const updateNodeInState = updatedNode => {
  const nodeIndex = appState.nodes.findIndex(n => n.id === updatedNode.id)

  appState.nodes[nodeIndex] = updatedNode

  setState({
    ...appState
  })
}

const removeNodeFromState = nodeId => {
  const newNodes = appState.nodes.filter(n => n.id !== nodeId)

  setState({
    ...appState,
    nodes: newNodes
  })
}

liveEvents.onmessage = event => {
  const data = JSON.parse(event.data)

  // eslint-disable-next-line default-case
  switch (data.type) {
    case 'INSERT':
      setState({
        ...appState,
        nodes: [...appState.nodes, data.node]
      })
      break
    case 'UPDATE':
      updateNodeInState(data.node)
      break
    case 'DELETE':
      removeNodeFromState(data.node.id)
      break
  }
}

getAllNodes().then(nodes => {
  setState({ nodes: nodes || [] })
})
