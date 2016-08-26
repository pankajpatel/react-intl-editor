import { combineReducers } from 'redux';
import {reducer as form} from 'redux-form'
import { routerReducer as routing } from 'react-router-redux';

import files from './modules/files.mod';
import transunits from './modules/transunit.mod';
import search from './modules/search.mod';

export default combineReducers({
  files,
  transunits,
  form,
  search,
  routing,
});
