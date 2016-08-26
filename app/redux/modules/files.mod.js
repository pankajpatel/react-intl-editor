import R from 'ramda'
import update from 'react-addons-update'

export const FILE_DESC = [
  {
    name: 'defaultMsg',
    label: 'Descriptions',
    validators: [
      { code: 'shape',   fn: R.isArrayLike },
      { code: 'length',  fn: R.length },
      { code: 'content', fn: R.all(validateDefaultMessageFile) },
    ],
    help: "This file contains original strings and description of their usage. It can not be modified."
  },
  {
    name: 'catalog',
    label: 'Translations',
    validators: [
      { code: 'shape',  fn: R.is(Object) },
      { code: 'shape',  fn: R.pipe(R.isArrayLike, R.not) },
      { code: 'length', fn: R.pipe(R.values, R.length) },
    ],
    help: "This file contains only translated strings (one file per language)."
  }
]

/*
  Validators
*/

function validateDefaultMessageFile(data) {
  return R.allPass([
    R.has('descriptors'),
    R.has('path'),
    R.isArrayLike(R.prop('descriptors', data)),
    R.length(R.prop('descriptors', data))
  ], data)
}

/*
  Actions
*/

export const FILE_STORE              = 'FILE_STORE';
export const FILE_RESET              = 'FILE_RESET';

/**
 * @param {String} name       - default|lang (ie defaultMessages.json or <lang>.json)
 * @param {Object} file       - HTML5 File object
 * @param {Mixed} data        - JSON parsed file content
 */
export function storeFile(name, file, data) {
  return {
    type: FILE_STORE,
    payload: {
      name,
      file,
      data
    }
  }
}

/**
 * Reset file infos & data
 */
export function resetFile(name) {
  return {
    type: FILE_RESET,
    payload: {
      name
    }
  }
}

/*
  Reducers
*/

export const filesDefaultState = (function () {
  return R.pipe(
    R.map( d => ([ d.name, {} ]) ),
    R.fromPairs
  )(FILE_DESC)
})()

export default function file(state = filesDefaultState, { type, payload }) {
  const { name, file, data } = payload || {}

  switch (type) {
    case FILE_STORE:
      return update(state,{
        [name]: { $set: {
          name: file.name,
          lastModified: file.lastModified,
          size: file.size,
          data
        }}
      })
    case FILE_RESET:
      return update(state, {
        [name]: { $set: [] }
      })
  }

  return state
}


/*
  Selectors
 */

export const getFiles = (state) => (state.files)
