/* eslint-disable camelcase */
import { h } from 'superfine'
import animate from './animate'
import getNodeStyle from './getNodeStyle'

const NodeChildren = (props, children) => animate(
{
  translateX: [-150, 0],
  opacity: [0, 1],
  stagger: 100
}, (
    <div {...props}>{children}</div>
  )
)

const handleLinkClick = callback => e => {
  e.preventDefault()
  e.stopPropagation()
  callback(e)
}

export default ({
  expanded,
  name,
  id,
  lower_bound,
  upper_bound,
  children_length,
  children,
  onedit,
  ondelete,
  styles,
  ...props
}) => {
  const className = [styles.node, styles[getNodeStyle(id)]]

  if (expanded) className.push(styles.expanded)

  return (
    <div class={className.join(' ')} {...props}>
      <div class={styles.nodePanel}>
        <h3>{name}</h3>
        <span>{`Range: ${lower_bound}–${upper_bound}`}</span>
        <span>{`Length: ${children_length}`}</span>
        {expanded && (
          <div class={styles.buttonBar}>
            <a
              href="#"
              onclick={handleLinkClick(ondelete)}
              class={styles.buttonLink}
            >Delete</a>
            <a
              href="#"
              onclick={handleLinkClick(onedit)}
              class={[styles.buttonLink, styles.primary].join(' ')}
            >Edit</a>
          </div>
        )}
      </div>
      {expanded && (
        <NodeChildren class={styles.nodeChildren}>{
          children.map(child => <div key={child} class={styles.nodeChild}>{child}</div>)
        }</NodeChildren>
      )}
    </div>
  )
}