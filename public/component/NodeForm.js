import { h } from 'superfine'

const setState = node => e => {
  node[e.target.name] = e.target.value
}

const Input = ({ id, node, ...props }) => {
  return (
    <input
      id={id}
      name={id}
      {...props}
      onchange={setState(node)}
      onfocus={e => e.target.select()}
      value={node[id]}
    />
  )
}

const getFormElement = (e, name) => e.target.closest('form').elements[name]

// eslint-disable-next-line max-lines-per-function
export default ({
  node = {},
  display,
  styles,
  oncancel,
  style,
  ...props
}) => {
  const formStyle = { display: display === true ? 'block' : 'none' }

  return (
    <form
      style={formStyle}
      class={[styles.nodeForm, style].join(' ')}
      {...props}>
      {node.id && <input name="id" type="hidden" value={node.id} />}
      <label>
        <span>Name: </span>
        <Input
          type="text"
          id="name"
          value={node.name}
          size="55"
          autofocus="true"
          node={node}
          style={{ width: '70%' }}
        />
      </label>
      <fieldset>
        <legend>Children</legend>
        <label>
          <span>Range:</span>
          <Input
            id="lower_bound"
            type="number"
            node={node}
            min="0"
            max={node.upper_bound}
            oninput={e => {
              getFormElement(e, 'upper_bound').min = e.target.value
            }}
          />
          <Input
            id="upper_bound"
            type="number"
            node={node}
            min={node.lower_bound}
            oninput={e => {
              getFormElement(e, 'lower_bound').max = e.target.value
            }}
          />
        </label>
        <label>
          <span>Length:</span>
          <Input
            id="children_length"
            type="number"
            min="0"
            max="15"
            node={node}
          />
          <small>(15 or less)</small>
        </label>
      </fieldset>
      <div class={styles.buttonBar}>
        <a
          href="#"
          class={styles.buttonLink}
          onclick={e => {
            e.preventDefault()
            oncancel(e)
          }}
        >Cancel</a>
        <button class={styles.primary} type="submit">Save</button>
      </div>
    </form>
  )
}