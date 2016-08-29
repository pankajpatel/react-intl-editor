import R from 'ramda'
import React from 'react'
import reactStamp from 'react-stamp'
import { connect } from 'react-redux'
import { buildFilter } from 'lib/search_list'
// import { setDirty } from 'lib/dirty'

import * as fileMod from 'redux/modules/files.mod'
import * as tuMod from 'redux/modules/transunit.mod'

import { Header, Row } from './row'

const { array, func } = React.PropTypes

/*
  Apply search filter
*/

const searchList = buildFilter()
  .addFilterOnCols({
    critPath: ['filter'],
    cols: ['defaultMessage', 'message', 'id', 'description']
  })
  .addFilter(
    c  => c.untranslated,
    () => R.propEq('translated', false)
  )

const searchListIds = buildFilter()
  .addFilter(
    c  => true,
    (c) => (row) => R.contains(row.id, c.ids)
  )

/*
  Component
*/

const List = reactStamp(React).compose({

  displayName: 'Transunits.List',

  propTypes: {
    transunits   : array.isRequired,
    updateMessage: func.isRequired,
  },

  init() {
    this.renderRow = this.renderRow.bind(this)
  },

  render() {
    const { transunits } = this.props

    return (
      <div className="list">
        <Header/>
        <div className="list-body">
          {
            transunits.map( this.renderRow )
          }
        </div>
      </div>
    );
  },

  renderRow(transunit) {
    const { updateMessage, files: { whitelist } } = this.props
    const { id } = transunit
    return <Row key={id}
                updateMessage={ updateMessage }
                showWhitelist={ whitelist && whitelist.name ? true : false }
                {...transunit}
                />
  }

})

/*
  Container
 */

let current = {
  ids: [],
  filter: false
}

function stateToProps(state) {
  const list = tuMod.getTransunits(state)
  const { transunitSearchForm } = state.search

  // filter changed => recalc tranunit ids filter
  if (!R.equals(current.filter, transunitSearchForm)) {
    const filteredList = searchList.filterCache(R.values(list), transunitSearchForm)
    current.ids = R.pluck('id', filteredList)
    current.filter = transunitSearchForm
  }

  return {
    files: fileMod.getFiles(state),
    transunits: searchListIds.filter(R.values(list), current)
  }
}

function dispatchToProps(dispatch) {
  return {
    updateMessage(values) {
      dispatch(tuMod.updateEntity(values))
      // setDirty(fileName, true)
    },
  }
}

export default connect(stateToProps, dispatchToProps)(List);
