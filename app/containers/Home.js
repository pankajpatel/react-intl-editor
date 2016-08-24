import React, { Component } from 'react';
// import React from 'react'
// import reactStamp from 'react-stamp'
import { connect } from 'react-redux'
// import { bindActionCreators } from 'redux'
import Home from '../components/Home.js'
import * as fileMod from '../redux/modules/files.mod'

// Sinon Hot reload ne fonctionne pas avec les children en react-stamp
class HomeContainer extends React.Component {
  render() {
    return <Home {...this.props}/>
  }
}

function stateToProps(state) {
  return {
    files: fileMod.getFiles(state)
  };
}

function dispatchToProps(dispatch) {
  return {
    storeFile(name, file, data) {
      dispatch(fileMod.storeFile(name, file, data))
    }
  }
}

export default connect(stateToProps, dispatchToProps)(HomeContainer);
