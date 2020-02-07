// useState -> Definir estados
// useEffect -> componentDidMount
import React, { useState, useEffect } from 'react';
// useSelector -> Acessar informação do estado do Redux;
// useDispatch -> Disparar action do Redux
import { useDispatch, useSelector } from 'react-redux';

// import { bindActionCreators } from 'redux';
import { MdAddShoppingCart } from 'react-icons/md';
import { formatPrice } from '../../util/format';
import api from '../../services/api';

import * as CartActions from '../../store/modules/cart/actions';

import { ProductList } from './styles';

export default function Home() {
  const [products, setProducts] = useState([]);

  const amount = useSelector(state =>
    state.cart.reduce((sumAmount, product) => {
      sumAmount[product.id] = product.amount;

      return sumAmount;
    }, {})
  );

  const dispatch = useDispatch();

  // Executa apenas uma vez quando o componente for montado, passar array vazio[] de dependencias no final (componentDidMount)
  useEffect(() => {
    async function loadProducts() {
      const response = await api.get('products');

      const data = response.data.map(product => ({
        ...product, // Pega todos produtos
        priceFormatted: formatPrice(product.price), // Adiciona nova informação
      }));

      setProducts(data);
    }

    loadProducts();
  }, []);

  function handleAddProduct(id) {
    dispatch(CartActions.addToCartRequest(id));
    // this.props.history.push('/cart'); // navegação utilizando React-Router-Dom por um método JavaScript
  }

  return (
    <ProductList>
      {products.map(product => (
        <li key={product.id}>
          <img src={product.image} alt={product.title} />
          <strong>{product.title}</strong>
          <span>{product.priceFormatted}</span>

          <button type="button" onClick={() => handleAddProduct(product.id)}>
            <div>
              <MdAddShoppingCart size={16} color="#FFF" />{' '}
              {amount[product.id] || 0}
            </div>

            <span>ADICIONAR AO CARRINHO</span>
          </button>
        </li>
      ))}
    </ProductList>
  );
}

// const mapStateToProps = state => ({
//   amount: state.cart.reduce((amount, product) => {
//     amount[product.id] = product.amount;

//     return amount;
//   }, {}),
// });

// Converte actions do Redux em propiedades do componente
// const mapDispatchToProps = dispatch =>
//   bindActionCreators(CartActions, dispatch);

// export default connect(null, mapDispatchToProps)(Home);
