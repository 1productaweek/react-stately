import { useContext } from 'react'
// import StatelyController from './StatelyController'
import { StatelyContext } from './Stately'

// @Igor - how can I pass the type in?
// export default function useStately<T = StatelyController> (field?: string) {
//   return useContext<T>(StatelyContext)
// }

export default function useStately (field?: string) {
  return useContext(StatelyContext)
}
