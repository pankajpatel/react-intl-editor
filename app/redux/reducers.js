import { combineReducers } from 'redux';
import { routerReducer as routing } from 'react-router-redux';

import files from './modules/files.mod';

export default combineReducers({
  files,
  routing,
});
