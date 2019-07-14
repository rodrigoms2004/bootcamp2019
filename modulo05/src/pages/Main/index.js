import React, { Component } from 'react';
import { FaGithubAlt, FaPlus, FaSpinner } from 'react-icons/fa';
import { Link } from 'react-router-dom';

import api from '../../services/api';

import Container from '../../components/Container';
import { Form, SubmitButton, MessageError, List } from './styles';


export default class Main extends Component {

  state = {
    newRepo: '',
    repositories: [],
    loading: 0,
    repoError: false,
    messageError: null,
  };

  // Carregar os dados do localStorage
  componentDidMount() {
    const repositories = localStorage.getItem('repositories');

    if (repositories) {
      this.setState({ repositories: JSON.parse(repositories) });
    }
  }

  // Salvar os dados no localStorage
  componentDidUpdate(_, prevState) {
    const { repositories } = this.state;

    if (prevState.repositories !== repositories) {
      localStorage.setItem('repositories', JSON.stringify(repositories));
    }
  }

  removeRepository = repoName => {
    // obtém os dados do repositório de key='repositories'
    const currentRepository = JSON.parse(localStorage.getItem('repositories'));

    // retorna um Array com todos os repositórios, exceto aquele que queremos remover
    const bufferRepository = currentRepository.filter(r => r.name !== repoName)

    // carrega o novo repositório
    if (bufferRepository) {
      this.setState({ repositories: bufferRepository })
    }
  }

  handleInputChange = e => {
    this.setState({
      newRepo: e.target.value,
      repoError: false,
      messageError: null
    });
  }

  handleSubmit = async e => {

      e.preventDefault();

      this.setState({ loading: 1 })

    try {
      const { newRepo, repositories } = this.state;


      if (newRepo === '') {
        throw 'Você precisa indicar um repositório';
      }

      const isRepoDuplicate = repositories.find(repository => repository.name === newRepo);

      if (isRepoDuplicate) {
        throw 'Repositório Duplicado';
      }

      const response = await api.get(`/repos/${newRepo}`);

      const data = {
        name: response.data.full_name,
      };

      this.setState({
        repositories: [...repositories, data],
        newRepo: '',
        loading: 0,
      })
    } catch(error) {

      // se a mensagem não vier do AXIOS, retorna error, caso contrário retorna error.message
      const generalError = String(!error.message ? error : error.message)

      // regex para encontrar erro: 'Request failed with status code 404'
      const re = new RegExp(/404/)
      // se for erro 404, retorna 'Repositório não encontrado', do contrário retorna mensagem armazenada
      const finalError = re.test(generalError) ? 'Repositório não encontrado' : generalError

      this.setState({
        repoError: true ,
        messageError: finalError, //!error.message ? error : error.message
      })
    } finally {
      this.setState({ loading: 0 })
    }
  };

  render() {
    const { newRepo, repositories, loading, repoError, messageError } = this.state;

    return (
      <Container>
        <h1>
          <FaGithubAlt />
          Repositórios
        </h1>


        <Form onSubmit={this.handleSubmit} repoError={repoError}>
          <input
            type="text"
            placeholder="Adicionar repositório"
            value={newRepo}
            onChange={this.handleInputChange}
          />

          <SubmitButton loading={loading}>
            { loading ? (
              <FaSpinner color='#FFF' size={14} />
            ) : (
              <FaPlus color="#FFF" size={14} />
            )}
          </SubmitButton>
        </Form>

        <MessageError messageError={messageError}>
              { messageError !== null ? (
                <div>{messageError}</div>
              ) : (
                <div></div>
              )}
        </MessageError>

        <List>
          {repositories.map(repository => (
            <li key={repository.name}>
              <span>{repository.name}</span>
              <Link to={`/repository/${encodeURIComponent(repository.name)}`}>Detalhes</Link>
              <button
                type="button"
                onClick={() => this.removeRepository(repository.name)}
              >Remover</button>
            </li>
          ))}
        </List>

      </Container>
    );
  }
}

// type="button"
// key={filter.label}
// onClick={() => this.handleFilterClick(index)}
