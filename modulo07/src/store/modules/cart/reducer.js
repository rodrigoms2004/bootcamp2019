// função que retorna conteúdo do carrinho
// todo reducer recebe por padrão as variaveis state e action, no caso ADD_TO_CART
export default function cart(state = [], action) {
  switch (action.type) {
    case 'ADD_TO_CART':
      return [...state, action.product];
    default:
      return state;
  }
}
