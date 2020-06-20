import { useState, useEffect } from 'react'
import mapValues from 'lodash/mapValues'
import size from 'lodash/size'
import useStately from './useStately'

export default function useStatelyMultiField (inputs?: { [key: string]: string }) {
  const stately = useStately()
  const [output, setOutput] = useState<{ [key: string]: any }>()
  useEffect(() => {
    if (!size(inputs)) return
    const unwatch = stately.watch('*', () => {
      const update = mapValues(inputs, (prop) => {
        return stately.getValue(prop)
      })
      setOutput(update)
    })
    return () => {
      unwatch()
    }
  }, [inputs, stately])
  return output
}
