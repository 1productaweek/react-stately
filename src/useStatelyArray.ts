import { useState, useEffect } from 'react'
import map from 'lodash/map'
import arrayMove from 'array-move'
import useStately from './useStately'

export interface StatelyArrayValueItem {
  key: string
  field: string
  remove: () => void
  initialValue: any
}

export interface StatelyArrayValue {
  fields: StatelyArrayValueItem[]
  add: () => void
  addWithInitialValue: (val: any) => void
  remove: (index: number) => void
  move: (oldIndex: number, newIndex: number) => void
}

// https://stackoverflow.com/questions/105034/create-guid-uuid-in-javascript
const uuidv4 = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0
    const v = c == 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

const useArrayField = (field: string, initialValue?: any[]): StatelyArrayValue => {
  const stately = useStately()

  const initialVals = stately.getValue(field) || initialValue

  const [initialValues, setInitialValues] = useState(map(initialVals, val => val))

  const initialKeys = initialValues ? map(initialValues, () => uuidv4()) : []

  const [keys, setKeys] = useState(initialKeys)

  useEffect(() => {
    const unwatch = stately.watch(field, (value: any, changedField: string) => {
      if (field === changedField) return
      setInitialValues(value)
    }, true)
    return () => { unwatch() }
  }, [field, stately])

  // Update stately with new array
  // useEffect(() => {
  //   stately.setValue(field, initialValues)
  // }, [field, initialValues, stately])

  const remove = (i: number) => {
    const newKeys = keys.slice(0, i).concat(keys.slice(i + 1, keys.length))
    setKeys(newKeys)
    const newInitialValues = initialValues.slice(0, i).concat(initialValues.slice(i + 1, initialValues.length))
    setInitialValues(newInitialValues)
    stately.setValue(field, newInitialValues)
  }

  const move = (oldIndex: number, newIndex: number) => {
    setKeys((keys) => arrayMove(keys, oldIndex, newIndex))
    const newVal = (values: any) => arrayMove(values, oldIndex, newIndex)
    setInitialValues(newVal)
    stately.setValue(field, newVal)
  }

  const add = () => {
    keys.push(uuidv4())
    setKeys([...keys])
  }

  const addWithInitialValue = (initialValue: any) => {
    keys.push(uuidv4())
    setKeys([...keys])
    const newInitialValues = [...(initialValues || [])]
    newInitialValues[keys.length - 1] = initialValue
    setInitialValues(newInitialValues)
    stately.setValue(field, newInitialValues)
  }

  const fields = keys.map((key, i) => ({
    key,
    field: `${field}.${i}`,
    remove: () => remove(i),
    initialValue: initialValues && initialValues[i],
  }))

  return { fields, add, addWithInitialValue, remove, move }
}

export default useArrayField
