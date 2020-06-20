import React from 'react'
import isFunction from 'lodash/isFunction'
import StatelyController from './StatelyController'

export const StatelyContext = React.createContext({} as any)

interface StatelyProps {
  onChange?: (value: any, stately: StatelyController) => void
  readOnly?: boolean
  deepValueCheck?: boolean
  initialValue?: any
}

class Stately extends React.Component <StatelyProps, {}> {
  controller: StatelyController

  constructor (props: StatelyProps) {
    super(props)
    this.controller = new StatelyController(
      props.initialValue,
      value => {
        if (this.props.onChange) this.props.onChange(value, this.controller)
        if (isFunction(this.props.children)) this.forceUpdate()
      },
      { readOnly: !!props.readOnly, deepValueCheck: !!props.deepValueCheck },
    )
  }

  componentDidUpdate () {
    this.controller.readOnly = !!this.props.readOnly
  }

  render () {
    const { children } = this.props
    return (
      <StatelyContext.Provider value={this.controller}>
        {isFunction(children) ? children(this.controller, this.controller.value) : children}
      </StatelyContext.Provider>
    )
  }
}

export default Stately
