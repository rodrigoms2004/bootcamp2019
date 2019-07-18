import React, { Component } from 'react';
import PropTypes from 'prop-types';
import api from '../../services/api';

import {
  Container,
  Header,
  Avatar,
  Name,
  Bio,
  Stars,
  Starred,
  OwnerAvatar,
  Info,
  Title,
  Author,
  Loading,
} from './styles';

export default class User extends Component {
  // navigationOptions precisa ser uma função que retorna um objeto para mudar a propriedade title
  static navigationOptions = ({ navigation }) => ({
    title: navigation.getParam('user').name,
  });

  state = {
    stars: [],
    loading: true,
    page: 1,
  };

  static propTypes = {
    navigation: PropTypes.shape({
      getParam: PropTypes.func,
      navigate: PropTypes.func,
    }).isRequired,
  };

  async componentDidMount() {
    this.load(); // carrega os repositorios
  }

  load = async (page = 1) => {
    const { navigation } = this.props;
    const user = navigation.getParam('user');

    // obtém repositório atual
    const { stars } = this.state;

    // obtém repositório
    const response = await api.get(`/users/${user.login}/starred`, {
      params: { page },
    });

    // se a página não for a primeira, soma arrays, caso contrário carrega epenas a resposta da API
    const bufferStars =
      page >= 2 ? [...stars, ...response.data] : response.data;

    // atualiza o status
    this.setState({
      stars: bufferStars,
      loading: false,
      refreshing: false,
      page,
    });
  };

  loadMore = () => {
    // obtém a página atual
    const { page } = this.state;

    const next = page + 1;

    this.load(next);
  };

  // refreshList
  refreshList = () => {
    this.setState({ refreshing: true });

    this.load();
  };

  handleNavigate = repository => {
    const { navigation } = this.props;

    navigation.navigate('Repository', { repository });
  };

  render() {
    const { navigation } = this.props;
    const { stars, loading, refreshing } = this.state;

    const user = navigation.getParam('user');

    return (
      <Container>
        <Header>
          <Avatar source={{ uri: user.avatar }} />
          <Name>{user.name}</Name>
          <Bio>{user.bio}</Bio>
        </Header>

        {loading ? (
          <Loading />
        ) : (
          <Stars
            data={stars}
            onRefresh={this.refreshList}
            refreshing={refreshing}
            onEndReachedThresshold={0.2}
            onEndReached={this.loadMore}
            // keyExtractor precisa retornar uma string
            keyExtractor={star => String(star.id)}
            renderItem={({ item }) => (
              <Starred onPress={() => this.handleNavigate(item)}>
                <OwnerAvatar source={{ uri: item.owner.avatar_url }} />
                <Info>
                  <Title>{item.name}</Title>
                  <Author>{item.owner.login}</Author>
                </Info>
              </Starred>
            )}
          />
        )}
      </Container>
    );
  }
}
