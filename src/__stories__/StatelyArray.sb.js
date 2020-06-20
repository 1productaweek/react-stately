import React from 'react'
// eslint-disable-next-line import/no-extraneous-dependencies
import { storiesOf } from '@storybook/react'
import DemoInput from './DemoInput'
import Stately from '../Stately'
import StatelyArray from '../StatelyArray'
// import useStatelyArray from './useStatelyArray'
import useStatelyField from '../useStatelyField'

const styles = {
  padding: 20,
  maxWidth: 300,
}

const Base = ({ children, css = {}, initialValue }) => (
  <Stately initialValue={initialValue}>
    {(stately) => (
      <>
        <div css={[styles, css]}>
          {children}
        </div>
        <pre>
          <code>
            {JSON.stringify(stately.value)}
          </code>
        </pre>
      </>
    )}
  </Stately>
)

storiesOf('Stately/StatelyArray', module)
  .add('Basic', () => (
    <Base>
      <StatelyArray field='hello'>
        {({ fields, add }) => {
          const el = fields.map(({ field, key, remove, initialValue }) => (
            <div key={key} style={{ marginBottom: '1em' }}>
              <DemoInput key={key} field={field} />
              <button onClick={remove}>Remove</button>
            </div>
          ))
          return (
            <div>
              {el}
              <div>
                <button onClick={add}>Add</button>
              </div>
            </div>
          )
        }}
      </StatelyArray>
    </Base>
  ))

  .add('Combined State', () => {
    const Child = () => {
      const [field] = useStatelyField('hello')

      return (
        <div>
          <StatelyArray field='hello'>
            {({ fields, add }) => {
              const el = fields.map(({ field, key, remove, initialValue }) => (
                <div key={key} style={{ marginBottom: '1em' }}>
                  <DemoInput key={key} field={field} />
                  <button onClick={remove}>Remove</button>
                </div>
              ))
              return (
                <div>
                  {el}
                  <div>
                    <button onClick={add}>Add</button>
                  </div>
                </div>
              )
            }}
          </StatelyArray>
          <div>
            {JSON.stringify(field)}
          </div>
        </div>
      )
    }
    return (
      <Base>
        <Child />
      </Base>
    )
  })
