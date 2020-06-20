import React, { useRef, forwardRef } from 'react'
import isFunction from 'lodash/isFunction'
import Stately from './Stately'
import StatelyController from './StatelyController'
import useCombinedRefs from './util/useCombinedRefs'

interface IStatelyFormProps {
  children: React.ReactNode
  onSubmit: (e: React.FormEvent<HTMLFormElement>, stately: StatelyController) => void
  onChange?: (value: any, stately: StatelyController) => void
  initialValue?: any
  readOnly?: boolean
}

function StatelyForm ({
  children, onSubmit, onChange, initialValue, readOnly, ...props
}: IStatelyFormProps, forwardedRef: React.Ref<Stately>) {
  const statelyRef = useRef<Stately | null>(null)
  const combinedRefs = useCombinedRefs(forwardedRef, statelyRef)

  const onFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const stately = statelyRef?.current?.controller
    if (onSubmit && stately) onSubmit(e, stately)
  }

  return (
    <Stately
      ref={combinedRefs}
      onChange={onChange}
      initialValue={initialValue}
      readOnly={readOnly}
    >
      {(stately: StatelyController, value: any) => (
        <form onSubmit={onFormSubmit} {...props}>
          {isFunction(children) ? children(stately, value) : children}
        </form>
      )}
    </Stately>
  )
}

export default forwardRef(StatelyForm)
