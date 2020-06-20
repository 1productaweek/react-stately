// import React from 'react'
// import Stately from './Stately'
import useStatelyArray from './useStatelyArray'

interface StatelyArrayProps {
  children: ([]) => React.ReactNode
  field: string
  initialValue?: any
}

export default function StatelyArray ({ children, field, initialValue }: StatelyArrayProps) {
  return children(useStatelyArray(field, initialValue) as any) // TODO: remove any
}
