import React, { useState, useEffect, useMemo, useCallback } from 'react';

function App() {
  const [tech, setTech] = useState(['ReactJS', 'React Native']);
  const [newTech, setNewTech] = useState('');

  const handleAdd = useCallback(() => {
    setTech([...tech, newTech]);
    setNewTech('');
  }, [newTech, tech]);

  // busca os dados já armazenados no storage, componentDidMount do Redux
  useEffect(() => {
    const storageTech = localStorage.getItem('tech');

    if (storageTech) {
      setTech(JSON.parse(storageTech));
    }

    // componentWillUnmount do Redux, executar alguma função
    // após que o componente deixa de ser montado
    // use effect
    // return () => {
    // document.removeEventListener()
    // };
  }, []);

  // só atualiza se techSize tiver um valor diferente
  const techSize = useMemo(() => tech.length, [tech]);

  // armazena dados no storage componentDidUpdate do Redux
  useEffect(() => {
    localStorage.setItem('tech', JSON.stringify(tech));
  }, [tech]);

  // <> é um fragment para ter mais de um componente em uma função
  return (
    <>
      <ul>
        {tech.map(t => (
          <li key={t}>{t}</li>
        ))}
      </ul>
      <strong>Você tem {techSize} tecnologias</strong>
      <br />
      <input value={newTech} onChange={e => setNewTech(e.target.value)} />
      <button type="button" onClick={handleAdd}>
        Adicionar
      </button>
    </>
  );
}

export default App;
