import { call, put, all, takeLatest } from 'redux-saga/effects';

import api from '../../../services/api';

import { addToCartSuccess } from './actions';

// usa generator * em vez de async await
function* addToCart({ id }) {
  const response = yield call(api.get, `/products/${id}`);

  yield put(addToCartSuccess(response.data));
}

export default all([
  // escuta a ação ADD_REQUEST e dispara addToCart para atualizar o numero de itens no carrinho
  takeLatest('@cart/ADD_REQUEST', addToCart),
]);
