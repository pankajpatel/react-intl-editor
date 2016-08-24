import R from 'ramda'

/*
  Actions
*/

export const FILE_STORE = 'FILE_STORE';

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

/*
  Reducers
*/

export default function file(state = {}, { type, payload }) {
  switch (type) {
    case FILE_STORE:
      const { name, file, data} = payload
      // console.log(type, payload)
      return R.merge(state, {
        [name]: {
          name: file.name,
          lastModified: file.lastModified,
          size: file.size,
          data
        }
      })
      // window.localStorage.setItem('counter', state);
      // return state
  }
  return state
}


/*
  Selectors
 */

export const getFiles = (state) => (state.files)
