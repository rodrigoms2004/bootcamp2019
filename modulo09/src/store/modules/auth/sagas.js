import { takeLatest, call, put, all } from 'redux-saga/effects';

import history from '~/services/history';
import api from '~/services/api';
import { signInSucess } from './actions';

export function* sigIn({ payload }) {
  const { email, password } = payload;

  const response = yield call(api.post, 'sessions', {
    email,
    password,
  });

  console.tron.log(response);
  const { token, user } = response.data;

  if (!user.provider) {
    console.tron.error('Usuário não é prestador!');
    return;
  }

  yield put(signInSucess(token, user));

  history.push('/dashboard');
}

export default all([takeLatest('@auth/SIGN_IN_REQUEST', sigIn)]);
