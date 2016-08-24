import React from 'react';
import { Route, IndexRoute } from 'react-router';
import App from './containers/App';
import Home from './containers/Home';
// import CounterPage from './containers/CounterPage';
// <Route path="/counter" component={CounterPage} />


export default (
  <Route path="/" component={Home}>
  </Route>
);
// <IndexRoute component={Home} />
