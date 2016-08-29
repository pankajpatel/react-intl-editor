/* globals document */
import R from 'ramda'
import React from 'react'
import reactStamp from 'react-stamp'
import { connect } from 'react-redux'
import * as fileMod from 'redux/modules/files.mod'
import * as tuMod from 'redux/modules/transunit.mod'

import { isDirty } from 'lib/dirty'
import { makeCatalogFile, makeWhitelistFile } from './_utils'

import Files from './files.js'
import List from './list'
import Search from './search'

const { object } = React.PropTypes

const Home = reactStamp(React).compose({

  propTypes: {
    files: object.isRequired,
    transunits: object,
  },

  init() {
    this._downloadFile = this._downloadFile.bind(this)
  },

  _downloadFile(name) {
    const { files, transunits } = this.props
    switch(name) {
      case 'catalog':
        return makeCatalogFile(files.catalog.name, transunits)
      case 'whitelist':
        return makeWhitelistFile(files.whitelist.name, transunits)
      // defaultMessage not editable => not downloadable
    }
  },

  hasTransunits() {
    const { transunits } = this.props
    const nb = transunits && R.keys(transunits).length || 0
    return nb > 0
  },

  render() {
    const hasTu = this.hasTransunits()
    return (
      <div className="flex-column">
        <header className="flex-content">
          <div className="flex-row">
            <div className="flex-content">
              <img src="./images/icon-xs.png" className="logo"/>
            </div>
            <div className="flex-1">
              <h1>Translation editor</h1>
            </div>
            <div className="flex-content">
              {
                isDirty() && <span>Unsaved changes</span>
              }
            </div>
          </div>
        </header>

        <section className="flex-content">
          <Files downloadFile={this._downloadFile}/>
        </section>
        { hasTu && this.renderSearch() }
        { hasTu && this.renderList() }
      </div>
    );
    // <div className="flex-content">
    //   { hasTu && this.renderSave() }
    // </div>
  },

  // renderSave() {
  //   return (
  //     <a className="btn" onClick={ this.downloadFile }>
  //       <i className="fa fa-fw fa-download"/> Save
  //     </a>
  //   )
  // },

  renderSearch() {
    if (!this.hasTransunits()) return
    return (
      <section className="flex-content">
        <div className="panel">
          <Search />
        </div>
      </section>
    )
  },

  renderList() {
    if (!this.hasTransunits()) return

    return (
      <section className="flex-1 flex-column">
        <List/>
      </section>
    )
  }

})

/*
  Container
 */

 function stateToProps(state) {
   return {
     files     : fileMod.getFiles(state),
     transunits: tuMod.getTransunits(state)
   };
 }

 export default connect(stateToProps)(Home);
