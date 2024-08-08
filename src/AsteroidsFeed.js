import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const AsteroidsFeed = () => {
  const [asteroids, setAsteroids] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAsteroids = async () => {
      try {
        const response = await axios.get(
          `https://api.nasa.gov/neo/rest/v1/feed?start_date=2024-08-01&end_date=2024-08-08&api_key=Tc5TMVFdHwedTPV8otKStEfhVoDQLMfiC6B1Nphj`
        );
        if (response.status === 200) {
          setAsteroids(response.data);
        } else {
          setError(`Erro na resposta da API: ${response.status}`);
        }
      } catch (err) {
        console.error('Erro ao buscar dados:', err);
        setError('Erro ao buscar dados. Verifique a chave da API ou sua conexão.');
      } finally {
        setLoading(false);
      }
    };

    fetchAsteroids();
  }, []);

  const formatNumber = (number) => {
    return typeof number === 'number' ? number.toFixed(2) : 'N/A';
  };

  if (loading) return <p className="loading">Carregando...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <div className="container-asteroids">
      <h1 className="titulo-asteroids">Dados dos Asteroides</h1>
      <p className='texto'>Bem-vindo ao nosso site dedicado à exploração dos asteroides próximos à Terra. Utilizando a API da NASA NeoWs (Near Earth Object Web Service), oferecemos uma visão detalhada sobre asteroides que se aproximam da Terra. Nosso objetivo é fornecer informações precisas e atualizadas sobre esses objetos espaciais, incluindo dados sobre sua velocidade, tamanho e distância mínima da Terra.

Aqui você pode explorar uma lista de asteroides com base nas datas de aproximação mais próximas, verificar detalhes específicos de cada asteroide e aprender mais sobre os impactos potenciais desses corpos celestes. Nossa interface é projetada para facilitar a visualização dos dados, com uma apresentação clara e intuitiva.

Navegue pelas informações, descubra mais sobre o nosso sistema solar e mantenha-se informado sobre os asteroides que cruzam nosso caminho!</p>
      <div className="container-asteroids-list">
        {asteroids && asteroids.near_earth_objects ? (
          Object.keys(asteroids.near_earth_objects).map(date => (
            <div key={date} className="data-group">
              <h2 className="data-date">{date}</h2>
              {asteroids.near_earth_objects[date].map(asteroid => (
                <div key={asteroid.id} className="cartao-asteroid">
                  <h3 className="titulo-asteroid">{asteroid.name}</h3>
                  <p className="descricao-asteroid">
                    <strong>Diâmetro (m): </strong>
                    {formatNumber(asteroid.estimated_diameter.meters.estimated_diameter_max)}
                  </p>
                  <p className="descricao-asteroid">
                    <strong>Velocidade (km/h): </strong>
                    {formatNumber(parseFloat(asteroid.close_approach_data[0].relative_velocity.kilometers_per_hour))}
                  </p>
                  <p className="descricao-asteroid">
                    <strong>Distância mínima (km): </strong>
                    {formatNumber(parseFloat(asteroid.close_approach_data[0].miss_distance.kilometers))}
                  </p>
                </div>
              ))}
            </div>
          ))
        ) : (
          <p className="sem-asteroids">Nenhum dado disponível no momento.</p>
        )}
      </div>
    </div>
  );
};

export default AsteroidsFeed;
