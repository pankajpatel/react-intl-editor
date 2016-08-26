import R from 'ramda'

export const SEARCH_SET_FILTER = 'SEARCH_SET_FILTER'

export const setFilter = (name, filter) => ({
  type: SEARCH_SET_FILTER,
  payload: {
    name, filter
  }
})

export default function reducer(state = {}, { type, payload }) {
  switch (type) {
    case SEARCH_SET_FILTER:
      const { name, filter } = payload
      return R.merge(state, { [name]:  filter })
    default:
      return state
  }
}
