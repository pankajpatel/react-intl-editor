/* globals window */
import R from 'ramda'
import { FILE_OPEN, FILE_STORE } from '../actions/files';

export default function file(state = {}, { type, payload }) {
  switch (type) {
    // case FILE_OPEN:
    //   console.log(type, payload)
    //   return state
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
