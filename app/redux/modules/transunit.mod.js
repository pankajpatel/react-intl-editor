/**
 * Transunit : descriptor + message (translation)
 *
 */
import R from 'ramda'
import update from 'react-addons-update'
import { setDirty } from 'lib/dirty'

const TRANSUNIT_MAKE_ENTITIES  = "TRANSUNIT_MAKE_ENTITIES"
const TRANSUNIT_CLEAR_ENTITIES = "TRANSUNIT_CLEAR_ENTITIES"
const TRANSUNIT_UPDATE         = "TRANSUNIT_UPDATE"

/**
 * @param {Array}  defaultMsg    - descriptors [ 0: { descriptors, path }, ... ]
 * @param {Object} catalog       - translated strings { id: message, ... }
 * @param {Object} whitelist     - whitelist message ids [ id, ... ]
 */
export function makeEntities({ defaultMsg={}, catalog=[], whitelist }) {
  if (defaultMsg.data && catalog.data) {
    return {
      type: TRANSUNIT_MAKE_ENTITIES,
      payload: {
        defaultMsg,
        catalog,
        whitelist
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
      const { id, message, whitelisted } = payload
      const tu = state[id]
      return update(state, {
        [id]: { $set: updateEntityWith(tu, { message, whitelisted }) }
      })
  }
  return state
}

/*
  Utilities
 */

function updateEntityWith(transunit, values) {
  const newData = setTranslated(R.merge(transunit, values))
  if (!R.equals(R.prop('whitelisted', transunit), R.prop('whitelisted', newData))) setDirty('whitelist', true)
  if (!R.equals(R.prop('message', transunit), R.prop('message', newData))) setDirty('catalog', true)
  return newData
}

function makeTransunitEntities({ defaultMsg, catalog, whitelist }) {
  const { data: descriptors }  = defaultMsg
  const { data: translations } = catalog
  const { data: whitelisted }  = whitelist

  return R.pipe(
    R.map( (file) => makeTransunitsFile(file, translations, whitelisted) ),
    R.flatten,
    R.reduce( (accu, tu) => {
      accu[tu.id] = tu
      return accu
    }, {})
  )(descriptors)

}

function makeTransunitsFile(file, transunits, whitelist) {
  const { path, descriptors } = file
  return R.map( d => {
    const message = transunits[d.id] || ''
    const whitelisted = whitelist && R.contains(d.id, whitelist) || false
    return setTranslated(
      R.merge(d, { path, message, whitelisted })
    )
  }, descriptors)
}

function setTranslated(transunit) {
  const { whitelisted, message, defaultMessage } = transunit
  const translated = (message.length > 0) && (whitelisted || (message != defaultMessage))
  return R.merge(transunit, { translated })
}

/*
  Selectors
 */

export const getTransunits = (state) => state.transunits
