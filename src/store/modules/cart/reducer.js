import produce from 'immer'; // Manipulação de estado

export default function cart(state = [], action) {
  // Só cai no reducer se a action for 'ADD_TO_CART'
  switch (action.type) {
    case 'ADD_TO_CART':
      return produce(state, draft => {
        const productIndex = draft.findIndex(p => p.id === action.product.id);

        // Verifica se encontrou o Index
        if (productIndex >= 0) {
          draft[productIndex].amount += 1;
        } else {
          draft.push({
            ...action.product,
            amount: 1,
          });
        }
      });
    case 'REMOVE_FROM_CART':
      return produce(state, draft => {
        const productIndex = draft.findIndex(p => p.id === action.id);

        // Verifica se encontrou o Index
        if (productIndex >= 0) {
          draft.splice(productIndex, 1);
        }
      });
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
