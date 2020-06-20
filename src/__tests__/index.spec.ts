import index from '../index'

describe('index.spec', () => {
  test('returns hello world', () => {
    expect(index()).toBe('Hello World!')
  })
})