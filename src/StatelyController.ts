import get from 'lodash/get'
import set from 'lodash/set'
import map from 'lodash/map'
import omit from 'lodash/omit'
import toPath from 'lodash/toPath'
import isEqual from 'lodash/isEqual'
import isString from 'lodash/isString'
import remove from 'lodash/remove'
import isFunction from 'lodash/isFunction'
import produce from 'immer'

export const fromPath = (path: string | string[]) => isString(path) ? path : map(path, (field) => toPath(field)).join('.')

export type StatelyControllerCallback<T = StatelyController> = (value: any, field: string, stately: T) => void
export interface IStatelyFormObject<T> { value: T }

export interface StatelyListener {
  id: number
  field: string
  cb: StatelyControllerCallback
  trackChildren: boolean
}

export interface StatelyControllerOptions {
  readOnly?: boolean
  deepValueCheck?: boolean
}

class StatelyController {
  value: any
  counter: number
  listeners: StatelyListener[]
  isDirty: boolean
  onChange: StatelyControllerCallback | null
  readOnly: boolean
  deepValueCheck?: boolean

  constructor (initialValue?: any, onChange?: StatelyControllerCallback, options?: StatelyControllerOptions) {
    this.value = initialValue
    this.counter = 0
    this.listeners = []
    this.onChange = onChange || null
    this.readOnly = (options && options.readOnly) || false
    this.deepValueCheck = (options && options.deepValueCheck) || false
    this.isDirty = false

    this.setValue.bind(this)
    this.getValue.bind(this)
  }

  getValue (field?: string | string[]) {
    if (!field) return this.value
    return get(this.value, field)
  }

  deleteValue (field?: string | string[]) {
    if (!field) return this.value

    this.value = omit(this.value, field)

    // Notify onChange
    if (this.onChange) this.onChange(this.value, fromPath(field), this)

    // Update the watchers!
    this.listeners.forEach((listener) => {
      this.maybeUpdateSubscription(fromPath(field), listener)
    })

    return this
  }

  setValue (field: string | string[], value: any, initial?: any) {
    if (this.readOnly) return false

    const existingValue = get(this.value, field)

    // Abort if this is an initial value, but value already exists - or
    // there is no change
    if ((initial && existingValue !== undefined) || existingValue === value) return false
    if (this.deepValueCheck && isEqual(value, existingValue)) return false

    // We must set an initial value for it set correctly
    if (this.value === undefined) this.value = {}

    // Has a change been made?
    if (!initial && value !== this.value) {
      this.isDirty = true
    }

    // set(this.value, field, value)

    // Set the value (if a fn, call it and pass in current value)
    const newValue = produce(this.value, (draftState: any) => {
      set(draftState, field,
        isFunction(value) ? value(this.getValue(field)) : value)
    })

    this.value = newValue

    // set(this.value, field,
    //   isFunction(value) ? value(this.getValue(field)) : value)

    // Notify onChange
    if (!initial && this.onChange) this.onChange(this.value, fromPath(field), this)

    // Update the watchers!
    this._updateAllListeners(field)

    return true
  }

  watch (field: string, cb: StatelyControllerCallback, trackChildren?: boolean) {
    const id = this.counter++
    const listener: StatelyListener = {
      id,
      cb,
      field,
      trackChildren: !!trackChildren,
    }
    this.listeners.push(listener)

    // Update listener on start
    this.maybeUpdateSubscription(field, listener)

    // Return fn to unwatch
    return () => {
      return remove(this.listeners, ({ id: cid }) => cid === id)
    }
  }

  _updateAllListeners (field: string|string[]) {
    this.listeners.forEach((listener) => {
      this.maybeUpdateSubscription(fromPath(field), listener)
    })
  }

  protected maybeUpdateSubscription (field: string, { field: listenerField, cb, trackChildren }: StatelyListener) {
    const setFieldPath = toPath(field)
    const listenerFieldPath = toPath(listenerField)
    const shouldUpdate = listenerField === '*' ||
      isEqual(listenerFieldPath.slice(0, setFieldPath.length), setFieldPath) ||
      (trackChildren && isEqual(setFieldPath.slice(0, listenerFieldPath.length), listenerFieldPath))
    if (shouldUpdate) {
      cb(this.getValue(listenerField), field, this)
    }
  }
}

export default StatelyController
