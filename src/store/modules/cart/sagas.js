// Middleware -> Ação entre a action e o reducer
// * -> (generator) -> como se fosse um async
// yield -> como se fosse um await do generator, sempre que usar um effect tem que colocar o yield

// put -> dispara action do Redux
// takeLatest -> se clicar 2x, utiliza apenas o ultimo click(se não tiver terminado a chamada a API, executa apenas uma vez)
// select -> responsavel por buscar informação dentro do estado
import { call, select, put, all, takeLatest } from 'redux-saga/effects';
import { toast } from 'react-toastify';
import api from '../../../services/api';
import history from '../../../services/history';
import { formatPrice } from '../../../util/format';
import { addToCartSuccess, updateAmountSuccess } from './actions';

function* addToCart({ id }) {
  const productExists = yield select(state =>
    state.cart.find(p => p.id === id),
  );

  // Consultando stock
  const stock = yield call(api.get, `stock/${id}`);

  const stockAmount = stock.data.amount;
  const currentAmount = productExists ? productExists.amount : 0; // 0 pq não tá no carrinho

  const amount = currentAmount + 1;

  if (amount > stockAmount) {
    toast.error('Quantidade solicitada fora de estoque!');
    return;
  }

  if (productExists) {
    yield put(updateAmountSuccess(id, amount));
  } else {
    const response = yield call(api.get, `/products/${id}`);

    const data = {
      ...response.data, // pega tudo que vem do data
      amount: 1,
      priceFormatted: formatPrice(response.data.price),
    };

    yield put(addToCartSuccess(data));
    history.push('/cart'); // Navegação de usuario no Saga
  }
}

function* updateAmount({ id, amount }) {
  if (amount <= 0) return;

  const stock = yield call(api.get, `stock/${id}`);

  const stockAmout = stock.data.amount;

  if (amount > stockAmout) {
    toast.error('Quantidade solicitada fora de estoque!');
    return;
  }

  yield put(updateAmountSuccess(id, amount));
}

export default all([
  takeLatest('@cart/ADD_REQUEST', addToCart),
  takeLatest('@cart/UPDATE_AMOUNT_REQUEST', updateAmount),
]);
