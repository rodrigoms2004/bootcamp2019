import React from 'react';
import PropTypes from 'prop-types';

import { Browser } from './styles';

export default function Repository({ navigation }) {
  console.tron.log(navigation);

  const repository = navigation.getParam('repository');

  return <Browser source={{ uri: repository.html_url }} />;
}

// se Repository fosse classe estes seriam métodos estáticos

Repository.propTypes = {
  navigation: PropTypes.shape({
    getParam: PropTypes.func,
  }).isRequired,
};

Repository.navigationOptions = ({ navigation }) => ({
  title: navigation.getParam('repository').name,
});
