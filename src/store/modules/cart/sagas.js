// Middleware -> Ação entre a action e o reducer
// * -> (generator) -> como se fosse um async
// yield -> como se fosse um await do generator

// put -> dispara action do Redux
//takeLatest -> se clicar 2x, utiliza apenas o ultimo click(se não tiver terminado a chamada a API, executa apenas uma vez)
import { call, put, all, takeLatest } from 'redux-saga/effects';
import api from '../../../services/api';
import { addToCartSucess } from './actions';

function* addToCart({ id }) {
  const response = yield call(api.get, `/products/${id}`);

  yield put(addToCartSucess(response.data));
}

export default all([takeLatest('@cart/ADD_REQUEST', addToCart)]);
