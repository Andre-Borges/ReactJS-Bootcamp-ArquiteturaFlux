// Middleware -> Ação entre a action e o reducer
// * -> (generator) -> como se fosse um async
// yield -> como se fosse um await do generator, sempre que usar um effect tem que colocar o yield

// put -> dispara action do Redux
// takeLatest -> se clicar 2x, utiliza apenas o ultimo click(se não tiver terminado a chamada a API, executa apenas uma vez)
// select -> responsavel por buscar informação dentro do estado
import { call, select, put, all, takeLatest } from 'redux-saga/effects';
import api from '../../../services/api';
import { formatPrice } from '../../../util/format';
import { addToCartSucess, updateAmount } from './actions';

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
    console.tron.warn('ERRO');
    return;
  }

  if (productExists) {
    yield put(updateAmount(id, amount));
  } else {
    const response = yield call(api.get, `/products/${id}`);

    const data = {
      ...response.data, // pega tudo que vem do data
      amount: 1,
      priceFormatted: formatPrice(response.data.price),
    };

    yield put(addToCartSucess(data));
  }
}

export default all([takeLatest('@cart/ADD_REQUEST', addToCart)]);
