import { h } from 'superfine'
import anime from 'animejs'

export default (animateProps, Component) => {
  const { stagger, ...animProps } = animateProps

  const prevOnCreate = Component.props.oncreate

    Component.props.oncreate = el => {
      const targets = el.children

      anime({
        targets,
        ...animProps,
        delay: anime.stagger(stagger)
      })

      if (prevOnCreate && typeof prevOnCreate === 'function') {
        prevOnCreate(el)
      }
    }

    return Component
}