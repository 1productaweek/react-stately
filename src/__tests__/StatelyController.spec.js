import StatelyController, { set } from '../StatelyController'

describe('StatelyController', () => {
  test('sets value to the provided initial value', () => {
    const val = { abc: 1 }
    const stately = new StatelyController(val)
    expect(stately.value).toBe(val)
  })

  test('gets value with given path', () => {
    const val = { abc: 1 }
    const stately = new StatelyController(val)
    expect(stately.getValue('abc')).toBe(1)
  })

  test('gets value with deep path', () => {
    const val = { abc: { xyz: ['a', 'b', 'c'] } }
    const stately = new StatelyController(val)
    expect(stately.getValue('abc.xyz[1]')).toBe('b')
  })

  test('gets undefined value for unpopulated path', () => {
    const val = { abc: 1 }
    const stately = new StatelyController(val)
    expect(stately.getValue('xyz')).toBe(undefined)
  })

  test('sets value for path', () => {
    const stately = new StatelyController()
    stately.setValue('abc', 1)
    expect(stately.value).toEqual({ abc: 1 })
  })

  test('sets value for deep path', () => {
    const stately = new StatelyController()
    stately.setValue('abc.xyz[1].pop', 1)
    expect(stately.value).toEqual({ abc: { xyz: [undefined, { pop: 1 }] } })
  })

  test('notifies onChange after setValue', () => {
    const fn = jest.fn()
    const stately = new StatelyController({}, fn)
    stately.setValue('abc', 1)
    expect(fn).toHaveBeenCalledWith({ abc: 1 }, 'abc', stately)
  })

  describe('watch', () => {
    test('watch is triggered after being registered', () => {
      const fn = jest.fn()
      const stately = new StatelyController({})
      stately.setValue('abc', 1)
      stately.watch('abc', fn)
      expect(fn).toHaveBeenCalledTimes(1)
      expect(fn).toHaveBeenCalledWith(1, 'abc', stately)
    })

    test('watch is triggered after being registered - with no value set', () => {
      const fn = jest.fn()
      const stately = new StatelyController({})
      stately.watch('abc', fn)
      expect(fn).toHaveBeenCalledTimes(1)
      expect(fn).toHaveBeenCalledWith(undefined, 'abc', stately)
    })

    test('watch is triggered for similar value', () => {
      const fn = jest.fn()
      const stately = new StatelyController({})
      stately.setValue('abc', {})
      stately.watch('abc', fn)
      stately.setValue('abc', {})
      expect(fn).toHaveBeenCalledTimes(2)
    })

    test('watch does not notify when no change', () => {
      const fn = jest.fn()
      const stately = new StatelyController({})
      stately.setValue('abc', 1)
      stately.watch('abc', fn)
      stately.setValue('abc', 1)
      stately.setValue('abc', 1)
      stately.setValue('abc', 1)
      expect(fn).toHaveBeenCalledTimes(1)
    })

    test('watch does not notify when no deep-equal change', () => {
      const fn = jest.fn()
      const stately = new StatelyController({}, null, { deepValueCheck: true })
      stately.setValue('abc', {})
      stately.watch('abc', fn)
      stately.setValue('abc', {})
      stately.setValue('abc', {})
      stately.setValue('abc', {})
      expect(fn).toHaveBeenCalledTimes(1)
    })

    test('watches specified path for changes', () => {
      const fn = jest.fn()
      const stately = new StatelyController({ abc: 1 })
      stately.watch('abc', fn)
      stately.setValue('abc', 2)
      expect(fn).toHaveBeenCalledWith(2, 'abc', stately)
    })

    test('watches specified deep path for changes', () => {
      const fn = jest.fn()
      const stately = new StatelyController()
      stately.watch('abc.xyz[0]', fn)
      stately.setValue('abc.xyz[0]', 3)
      expect(fn).toHaveBeenCalledWith(3, 'abc.xyz[0]', stately)
    })

    test('watches specified path notifies for child path changes', () => {
      const fn = jest.fn()
      const stately = new StatelyController()
      stately.watch('abc', fn, true)
      stately.setValue('abc.xyz', 3)
      expect(fn).toHaveBeenCalledWith({ xyz: 3 }, 'abc.xyz', stately)
    })

    test('watches specified path notifies for child path changes', () => {
      const fn = jest.fn()
      const stately = new StatelyController()
      stately.watch('abc', fn, true)
      stately.setValue('abc.xyz', 3)
      expect(fn).toHaveBeenCalledWith({ xyz: 3 }, 'abc.xyz', stately)
    })

    // test('watches specified path and does not notify on parent changes', () => {
    //   const fn = jest.fn()
    //   const stately = new StatelyController()
    //   stately.watch('abc.xyz', fn)
    //   stately.setValue('abc', {  })
    //   expect(fn).toHaveBeenCalledWith({ xyz: 3 }, 'abc.xyz', stately)
    // })

    test('removes watcher', () => {
      const fn = jest.fn()
      const stately = new StatelyController()
      const unwatch = stately.watch('abc', fn)
      expect(fn).toHaveBeenCalledTimes(1)
      unwatch()
      stately.setValue('abc', 3)
      expect(fn).toHaveBeenCalledTimes(1)
    })
  })

  // test('set value', () => {
  //   const obj = {}
  //   expect(set(obj, 'x', 2)).toEqual({ x: 2 })
  // })

  // test('set value multi depth', () => {
  //   const obj = {}
  //   expect(set(obj, 'x.y.z', 2)).toEqual({ x: { y: { z: 2 } } })
  // })
})
