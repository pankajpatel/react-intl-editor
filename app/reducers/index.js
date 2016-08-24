import { combineReducers } from 'redux';
import { routerReducer as routing } from 'react-router-redux';
import files from './files';
import counter from './counter';

const rootReducer = combineReducers({
  files,
  counter,
  routing,
});

export default rootReducer;
