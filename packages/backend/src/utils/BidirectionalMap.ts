export default class BidirectionalMap<K, V> {
  private readonly map: Map<K, V> = new Map()
  private readonly reverseMap: Map<V, K> = new Map()

  set = (key: K, value: V): void => {
    this.map.set(key, value)
    this.reverseMap.set(value, key)
  }

  get = (key: K): V | undefined => {
    return this.map.get(key)
  }

  getByKey = (key: K): V | undefined => {
    return this.get(key)
  }

  getByValue = (value: V): K | undefined => {
    return this.reverseMap.get(value)
  }

  has = (key: K): boolean => {
    return this.map.has(key)
  }

  hasKey = (key: K): boolean => {
    return this.has(key)
  }

  hasValue = (value: V): boolean => {
    return this.reverseMap.has(value)
  }

  delete = (key: K): void => {
    const value = this.map.get(key)
    if (value !== undefined) {
      this.map.delete(key)
      this.reverseMap.delete(value)
    }
  }

  deleteByKey = (key: K): void => {
    this.delete(key)
  }

  deleteByValue = (value: V): void => {
    const key = this.reverseMap.get(value)
    if (key !== undefined) {
      this.map.delete(key)
      this.reverseMap.delete(value)
    }
  }

  clear = (): void => {
    this.map.clear()
    this.reverseMap.clear()
  }

  forEach = (callback: (value: V, key: K) => void): void => {
    this.map.forEach(callback)
  }

  entries = (): IterableIterator<[K, V]> => {
    return this.map.entries()
  }

  keys = (): IterableIterator<K> => {
    return this.map.keys()
  }

  values = (): IterableIterator<V> => {
    return this.map.values()
  }

  size = (): number => {
    return this.map.size
  }

  reverse = (): BidirectionalMap<V, K> => {
    const reverseMap = new BidirectionalMap<V, K>()
    this.map.forEach((value, key) => {
      reverseMap.set(value, key)
    })
    return reverseMap
  }

  reverseEntries = (): IterableIterator<[V, K]> => {
    return this.reverseMap.entries()
  }

  reverseKeys = (): IterableIterator<V> => {
    return this.reverseMap.keys()
  }

  reverseValues = (): IterableIterator<K> => {
    return this.reverseMap.values()
  }
}
