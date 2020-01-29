import produce from 'immer'; // Manipulação de estado

export default function cart(state = [], action) {
  // Só cai no reducer se a action for 'ADD_TO_CART'
  switch (action.type) {
    case '@cart/ADD_SUCCESS':
      return produce(state, draft => {
        const { product } = action;
        draft.push(product);
      });
    case '@cart/REMOVE':
      return produce(state, draft => {
        const productIndex = draft.findIndex(p => p.id === action.id);

        // Verifica se encontrou o Index
        if (productIndex >= 0) {
          draft.splice(productIndex, 1);
        }
      });
    case '@cart/UPDATE_AMOUNT_SUCCESS': {
      return produce(state, draft => {
        const productIndex = draft.findIndex(p => p.id === action.id);

        // Verifica se encontrou o Produto
        if (productIndex >= 0) {
          draft[productIndex].amount = Number(action.amount);
        }
      });
    }

    default:
      return state;
  }
}

/*
Sem o immer

return [
  ...state,
  {
    ...action.product,
    amount: 1,
  },
]; 

*/
