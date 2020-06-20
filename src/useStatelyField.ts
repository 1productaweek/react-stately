import { useState, useEffect, useContext, useCallback } from 'react'
import { StatelyContext } from './Stately'
import StatelyController from './StatelyController'

export default function useStatelyField <T = any> (
  field: string | null,
  options?: { trackChildren?: boolean, initialValue?: any },
): [T, (value: T) => T, StatelyController] {
  const { trackChildren, initialValue } = options || {}
  const context = useContext(StatelyContext)
  const [state, setState] = useState(field && context.getValue(field))
  const setStately = useCallback((value: any) => field && context.setValue(field, value), [context, field])

  useEffect(() => {
    if (!field) return
    const unwatch = context.watch(field, (updatedVal: any) => {
      setState(updatedVal)
    }, !!trackChildren)
    return () => { unwatch() }
  }, [context, field, trackChildren])

  useEffect(() => {
    if (!field || state) return
    context.setValue(field, initialValue, true)
  }, [context, field, initialValue, state])

  return [state, setStately, context]
}
