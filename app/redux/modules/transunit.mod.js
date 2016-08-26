/**
 * Transunit : descriptor + message (translation)
 *
 */
import R from 'ramda'
import update from 'react-addons-update'

const TRANSUNIT_MAKE_ENTITIES  = "TRANSUNIT_MAKE_ENTITIES"
const TRANSUNIT_CLEAR_ENTITIES = "TRANSUNIT_CLEAR_ENTITIES"
const TRANSUNIT_UPDATE         = "TRANSUNIT_UPDATE"

/**
 * @param {Array} defaultMsg     - descriptors [ 0: { descriptors, path }, ... ]
 * @param {Object} catalog       - translated strings { id: message, ... }
 */
export function makeEntities({ defaultMsg={}, catalog=[] }) {
  if (defaultMsg.data && catalog.data) {
    return {
      type: TRANSUNIT_MAKE_ENTITIES,
      payload: {
        defaultMsg,
        catalog
      }
    }
  } else {
    return {
      type: TRANSUNIT_CLEAR_ENTITIES
    }
  }

}

/**
 * @param values {Object}   - { id, message }
 */
export function updateEntity(values) {
  return {
    type: TRANSUNIT_UPDATE,
    payload: values
  }
}

/*
  Reducers
*/

export default function transunit(state = {}, { type, payload }) {

  switch (type) {
    case TRANSUNIT_MAKE_ENTITIES:
      return makeTransunitEntities(payload)
    case TRANSUNIT_CLEAR_ENTITIES:
      return {}
    case TRANSUNIT_UPDATE:
      const { id, message } = payload
      const tu = state[id]
      const newValues  =  {
        message ,
        translated: message.length && (message != tu.defaultMessage)
      }

      return update(state, {
        [id]: { $set: R.merge(tu, newValues) }
      })
  }
  return state
}

/*
  Utilities
 */

function makeTransunitEntities({ defaultMsg, catalog }) {
  const { data: descriptors }  = defaultMsg
  const { data: translations } = catalog

  return R.pipe(
    R.map( (file) => makeTransunitsFile(file, translations) ),
    R.flatten,
    R.reduce( (accu, tu) => {
      accu[tu.id] = tu
      return accu
    }, {})
  )(descriptors)

}

function makeTransunitsFile(file, transunits) {
  const { path, descriptors } = file
  return R.map( d => {
    const message = transunits[d.id] || ''
    const translated = message.length && (message != d.defaultMessage)
    return R.merge(d, { path, message, translated })
  }, descriptors)
}

/*
  Selectors
 */

export const getTransunits = (state) => state.transunits
