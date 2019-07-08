// https://github.com/Rocketseat/bootcamp-gostack-desafio-04/blob/master/README.md#desafio-04-introdu%C3%A7%C3%A3o-ao-react

import React from 'react';
import './App.css';

import Header from './components/Header';
import PostList from './components/PostList';

function App() {
  return (
    <>
      <Header />
      <PostList />
    </>
  );
}

export default App;