
// export const FILE_OPEN  = 'FILE_OPEN';
export const FILE_STORE = 'FILE_STORE';

// export function openFile(name) {
//   return {
//     type: FILE_OPEN,
//     name
//   }
// }

/**
 * @param {String} name    - default|lang (ie defaultMessages.json or <lang>.json)
 * @param {Object} file    - HTML5 File object
 */
export function storeFile(name, file, data) {
  // return (dispatch, getState) => {
    return {
      type: FILE_STORE,
      payload: {
        name,
        file,
        data
      }
    }
    // const { files } = getState();

    // if (counter % 2 === 0) {
    //   return;
    // }
    //
    // dispatch(increment());
  // };
}

// export function decrement() {
//   return {
//     type: DECREMENT_COUNTER
//   };
// }
//
// export function save() {
//   return {
//     type: SAVE_COUNTER
//   };
// }
//
// export function incrementIfOdd() {
//   return (dispatch, getState) => {
//     const { counter } = getState();
//
//     if (counter % 2 === 0) {
//       return;
//     }
//
//     dispatch(increment());
//   };
// }
//
// export function incrementAsync(delay = 1000) {
//   return dispatch => {
//     setTimeout(() => {
//       dispatch(increment());
//     }, delay);
//   };
// }
