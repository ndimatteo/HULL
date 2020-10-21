/* global __DEV__ */

import {defer, from as observableFrom, of as observableOf, throwError} from 'rxjs'
import {mergeMap} from 'rxjs/operators'

// eslint-disable-next-line import/no-commonjs
const {StructureBuilder} = require('@sanity/structure')

let prevStructureError = null
if (__DEV__) {
  if (module.hot && module.hot.data) {
    prevStructureError = module.hot.data.prevError
  }
}

export function isSubscribable (thing) {
  return thing && (typeof thing.then === 'function' || typeof thing.subscribe === 'function')
}

export function isStructure (structure) {
  return (
    structure &&
    (typeof structure === 'function' ||
      typeof structure.serialize !== 'function' ||
      typeof structure.then !== 'function' ||
      typeof structure.subscribe !== 'function' ||
      typeof structure.type !== 'string')
  )
}

export function serializeStructure (item, context, resolverArgs = []) {
  // Lazy
  if (typeof item === 'function') {
    return serializeStructure(item(...resolverArgs), context, resolverArgs)
  }

  // Promise/observable returning a function, builder or plain JSON structure
  if (isSubscribable(item)) {
    return observableFrom(item).pipe(
      mergeMap(val => serializeStructure(val, context, resolverArgs))
    )
  }

  // Builder?
  if (item && typeof item.serialize === 'function') {
    return serializeStructure(item.serialize(context))
  }

  // Plain value?
  return observableOf(item)
}

export function getDefaultStructure () {
  const items = StructureBuilder.documentTypeListItems()
  return StructureBuilder.list()
    .id('__root__')
    .title('Content')
    .showIcons(items.some(item => item.getSchemaType().icon))
    .items(items)
}

// We are lazy-requiring/resolving the structure inside of a function in order to catch errors
// on the root-level of the module. Any loading errors will be caught and emitted as errors
// eslint-disable-next-line complexity
export function loadStructure () {
  let structure
  try {
    const mod = require('part:@sanity/desk-tool/structure?') || getDefaultStructure()
    structure = mod && mod.__esModule ? mod.default : mod

    // On invalid modules, when HMR kicks in, we sometimes get an empty object back when the
    // source has changed without fixing the problem. In this case, keep showing the error
    if (
      __DEV__ &&
      prevStructureError &&
      structure &&
      structure.constructor.name === 'Object' &&
      Object.keys(structure).length === 0
    ) {
      return throwError(prevStructureError)
    }

    prevStructureError = null
  } catch (err) {
    prevStructureError = err
    return throwError(err)
  }

  if (!isStructure(structure)) {
    return throwError(
      new Error(
        `Structure needs to export a function, an observable, a promise or a stucture builder, got ${typeof structure}`
      )
    )
  }

  // Defer to catch immediately thrown errors on serialization
  return defer(() => serializeStructure(structure))
}
