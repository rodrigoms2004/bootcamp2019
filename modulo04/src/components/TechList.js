import React, { Component } from 'react';

import TechItem from './TechItem';

class TechList extends Component {

  // para state funcionar fora do construtor instalar:
  // yarn add @babel/plugin-proposal-class-properties -D
  state = {
    newTech: '',
    techs: []    
  };

  // Executado assim que o componente aparece na tela
  componentDidMount() {
    const techs = localStorage.getItem('techs')

    if (techs) {
      this.setState({ techs: JSON.parse(techs) })
    }
  }

  // Executado semrpe que houver alterações nas props ou estado
  // recebe como parametros as proprieadades antigas e os estados antigos
  // quando não for utilizar prevProps, colocar um _
  // componentDidUpdate(prevProps, prevState) {
  componentDidUpdate(_, prevState) {
    // this.props, this.state

    // verifica se estado anterior mudou 
    if (prevState.techs !== this.state.techs) {
      // armazena os dados do array techs no banco de dados do navegador
      // como o navegador não aceita arrays, salva em formato JSON
      localStorage.setItem('techs', JSON.stringify(this.state.techs))
      // no modo debug do navegador, selecionar Application>Storage>Local Storage
    }
  }

  // Executado quando o componente deixa de existir
  componentWillUnmount() {

  }

  // função precisa ser arrow function para poder acessar this
  handleInputChange = e => {
    this.setState({ newTech: e.target.value })
  }

  handleSubmit = e => {
    e.preventDefault(); // evita comportamento default do formulario
    
    // é necessário recriar o array do zero, todo o estado do react é imutável
    // copia o array techs e adiciona a informação de newTech
    this.setState({ 
      techs: [...this.state.techs, this.state.newTech] ,
      newTech: ''
    })
  }

  handleDelete = (tech) => {
    // retorna array removendo item selecionado
    this.setState({ techs: this.state.techs.filter(t => t !== tech )})
  }
  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <ul>
          {this.state.techs.map(tech => (
            <TechItem 
              key={tech} 
              tech={tech} 
              onDelete={() => this.handleDelete(tech)} 
            />
          ))}
          {/* <TechItem /> */}
        </ul>
        <input 
          type="text" 
          onChange={this.handleInputChange} 
          value={this.state.newTech} 
        />
        <button type="submit">Enviar</button>
      </form>
    )
  }
}

export default TechList;