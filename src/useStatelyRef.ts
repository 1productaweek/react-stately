import { useState, useCallback } from 'react'
import StatelyController from './StatelyController'

export default function useStatelyRef () {
  const [controller, setController] = useState<StatelyController|null>(null)
  const createRef = useCallback(ref => setController(ref.controller), [])
  return [createRef, controller && controller.getValue(), controller]
}
