# React Stately

This package allows you to easily manage state in forms or anything else - using hooks!

### Stately

Wrap your form (or any other component) in Stately. Any child components can now use Stately hooks - see below.

```jsx
import { Stately } from '@1productaweek/react-stately'

<Stately initialValue={{ abc: 1 }}>
  <form onSubmit={onSubmitHandler}>
    <StatelyInput field='name.of.prop' />
  </form>
</Stately>
```

You can also pass in a function as a child, to get access to the stately controller.

```jsx
import { Stately } from '@1productaweek/react-stately'

<Stately initialValue={{ abc: 1 }}>
  {(stately: StatelyController, value: any) => (
    <StatelyInput field='name.of.prop' />
  )}
</Stately>
```


### Create your own Stately inputs

You can use `useStatelyField` hook to easily create your own inputs.

```jsx
import React from 'react'
import { useStatelyField } from '@1productaweek/react-stately'

function StatelyInput ({ field, onChange, initialValue, forwardedRef, ...props }: any) => {
  const [value, setValue] = useStatelyField(field, { initialValue })
  return (
    <input
      {...props}
      forwardedRef={forwardedRef}
      value={!value ? '' : value}
      onChange={(e: any) => {
        setValue(e.target.value)
        if (onChange) onChange(e)
      }}
    />
  )
}
```

### Hooks

#### `useStately()`

Gets the stately controller. Stately controller has methods: `getValue(field)`, `setValue(field, value)` and `watch(field, fn)`

```jsx
import { useStately } from '@1productaweek/react-stately'

const stately = useStately()
```

#### `useStatelyField(field, options)`

Allows you to get/set a specific field value in the stately tree. If trackChildren is set, then value is updated for any change to `path.to.prop` and for any changes to it's children values (e.g. `path.to.prop.child`).

```jsx
import { useStatelyField } from '@1productaweek/react-stately'

const [value, setValue] = useStatelyField('path.to.prop', { initialValue: 'init', trackChildren: true })
```


#### `useStatelyArray(field, initialValue)`

Allows you to create and manage an array value. Arrays work differently, because ordering is important. `initialValue` defaults to `[]`.

`useStatelyArray` returns an object with the following props:

 * `fields` - an array of objects - `key`, `field`, `remove()` and `initialValue`
 * `add()` - add a blank value to the array
 * `addWithInitialValue` - 
 * `remove()` - remove an item at the specified index
 * `move(fromIndex, toIndex)` - move array item from one position ot another

```jsx
import { useStatelyArray } from '@1productaweek/react-stately'

const {
  fields, add, addWithInitialValue, remove, move
} = useStatelyArray('path.to.prop', ['abc'])

const els = fields.map(({ key, field, remove }, i) => (
  <>
    <StatelyInput field={field} key={key} />
    <button onClick={remove}>Delete</button>
  </>
))
```


### Made by 1PAW

https://1productaweek.com
  * |- [Ralley](https://ralley.io) - queue as a service
  * |- [Snapboard](https://snapboard.io) - hackable dashboard
