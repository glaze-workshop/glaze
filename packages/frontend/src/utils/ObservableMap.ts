import { BehaviorSubject, filter, from, map, mergeMap, of, switchMap } from 'rxjs'

export class ObservableMap<K, V> {
  mapSubject = new BehaviorSubject(new Map<K, BehaviorSubject<V>>())

  get map(): Map<K, BehaviorSubject<V>> {
    return this.mapSubject.value
  }

  set = (key: K, value: V) => {
    this.update(key, () => value)
  }

  update = (key: K, f: (preValue?: V) => V) => {
    const subject = this.mapSubject.value.get(key)
    if (subject) {
      subject.next(f(subject.value))
    } else {
      this.map.set(key, new BehaviorSubject(f()))
      this.mapSubject.next(this.map)
    }
  }

  getValueSubject = (key: K): BehaviorSubject<V> | undefined => {
    return this.map.get(key)
  }

  getValue = (key: K) => this.map.get(key)?.value

  delete = (key: K) => {
    this.map.delete(key)
    this.mapSubject.next(this.map)
  }

  observeKey = (key: K) => {
    return this.mapSubject.pipe(
      map((map) => map.get(key)),
      switchMap((valueSubject) => valueSubject || of(null))
    )
  }
}
