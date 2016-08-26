import React from 'react';
import Home from 'components/home.js'

// Sinon Hot reload ne fonctionne pas avec les children en react-stamp
export default class HomeContainer extends React.Component {
  render() {
    return (
      <article className="flex-column">
        <Home/>
      </article>
    )
  }
}
