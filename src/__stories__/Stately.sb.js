import React from 'react'
// eslint-disable-next-line import/no-extraneous-dependencies
import { storiesOf } from '@storybook/react'
import DemoInput from './DemoInput'
import Stately from '../Stately'

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
            {JSON.stringify(stately.value, null, 2)}
          </code>
        </pre>
      </>
    )}
  </Stately>
)

storiesOf('Stately/Stately', module)
  .add('Default', () => (
    <Base>
      <DemoInput field='hello' />
    </Base>
  ))

  .add('Initial Value', () => (
    <Base initialValue={{ hello: 'world' }}>
      <DemoInput field='hello' />
    </Base>
  ))
