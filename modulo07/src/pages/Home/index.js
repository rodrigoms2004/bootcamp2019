import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { MdAddShoppingCart } from 'react-icons/md';
import { ProductList } from './styles';
import { formatPrice } from '../../util/format';
import api from '../../services/api';

class Home extends Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
  };

  state = {
    products: [],
  };

  async componentDidMount() {
    const response = await api.get('products');

    // evitar chamar funções dentro do render()
    const data = response.data.map(product => ({
      ...product,
      priceFormatted: formatPrice(product.price),
    }));

    this.setState({ products: data });
  }

  handleAddProduct = product => {
    const { dispatch } = this.props; // dispatch é uma propriedade do redux

    dispatch({
      type: 'ADD_TO_CART',
      product,
    });
  };

  render() {
    const { products } = this.state;

    return (
      <ProductList>
        {products.map(product => (
          <li key={product.id}>
            <img src={product.image} alt={product.title} />
            <strong>{product.title}</strong>
            <span>{product.priceFormatted}</span>

            <button
              type="button"
              onClick={() => this.handleAddProduct(product)}
            >
              <div>
                <MdAddShoppingCart size={16} color="FFF" /> 3
              </div>

              <span>ADICIONAR AO CARRINHO</span>
            </button>
          </li>
        ))}
      </ProductList>
    );
  }
}

export default connect()(Home);
