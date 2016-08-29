import React from 'react'
import reactStamp from 'react-stamp'
import connectSearch from 'lib/connect_search'
import SearchStamp from 'lib/search.stamp'

import Form, { Input, Checkbox } from './form.comp'

const { object } = React.PropTypes

const FORM_NAME = 'transunitSearchForm'
const fields = ['filter', 'untranslated', 'whitelisted', 'counter'] // counter used to force list refresh

/*
  Component
 */

const SearchForm = reactStamp(React).compose(SearchStamp, {

  displayName: 'Transunits.Search',

  propTypes: {
    fields: object.isRequired
  },

  init() {
    this._onSearch = this._onSearch.bind(this)
  },

  _onSearch() {
    const { fields: { counter } } = this.props
    counter.onChange(counter.value + 1)
  },

  render: function() {
    const { fields: { filter, untranslated, whitelisted } } = this.props

    return (
      <Form onSubmit={this.preventSubmit}>
        <div className="flex-row">
          <div className="input-group flex-1">
            <span className="input-group-addon">
              <i className="fa fa-search"/>
            </span>
            <Input field={filter} placeholder="Search"/>
          </div>
          <div className="flex-content">
            <div className="form-control-static">
              <Checkbox field={untranslated} label="Untranslated"/>
            </div>
          </div>
          <div className="flex-content">
            <div className="form-control-static">
              <Checkbox field={whitelisted} label="Whitelist"/>
            </div>
          </div>
          <a className="btn flex-content" onClick={this._onSearch}>
            <i className="fa fa-refresh"/>
          </a>
        </div>
      </Form>
    )
  }
})

/*
  Container
 */

 function stateToProps() {
   return {
     initialValues: {
       filter: '',
       untranslated: false,
       counter: 0
     }
   }
 }

 export default connectSearch(
   {
     form: FORM_NAME,
     fields: fields
   },
   stateToProps
 )(SearchForm)
