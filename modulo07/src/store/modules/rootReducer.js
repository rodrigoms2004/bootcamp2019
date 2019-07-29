import { combineReducers } from 'redux';

import cart from './cart/reducer';

// armazena todos os reducers
export default combineReducers({
  cart,
});
