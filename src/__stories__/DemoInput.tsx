import React from 'react'
import useStatelyField from '../useStatelyField'

const styles = {
  borderRadius: 3,
  padding: '0.5em',
  outline: 'none',
  fontSize: '1em',
  border: '1px solid #ccc',
}

function StatelyInput ({ field, onChange, initialValue, ...props }: any) {
  const [value, setValue] = useStatelyField(field, initialValue)
  return (
    <input
      {...props}
      style={styles}
      value={!value && value !== 0 ? '' : value}
      onChange={e => {
        setValue(e.target.value)
        if (onChange) onChange(e)
      }}
    />
  )
}

export default StatelyInput
