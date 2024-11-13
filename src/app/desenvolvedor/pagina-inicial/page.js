'use client';

import Pagina from '@/components/Pagina';
import apiJogos from '@/api/api';
import React, { useEffect, useState } from 'react';
import { Button, Card, Col, Row } from 'react-bootstrap';
import { FaPen, FaPlusCircle, FaTrash } from 'react-icons/fa';
import { useRouter } from 'next/navigation';

export default function Page() {
  const [desenvolvedores, setDesenvolvedores] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const desenvolvedoresLocal = JSON.parse(localStorage.getItem('desenvolvedor')) || [];
    
    async function fetchDesenvolvedores() {
      try {
        const resultado = await apiJogos.get('/developers?key=3c9f3f7cdd874ffa985c468ad4b83467');
        const desenvolvedoresApi = resultado.data.results.map(dev => ({
          id: dev.id,
          nome: dev.name,
        }));

        setDesenvolvedores([...desenvolvedoresLocal, ...desenvolvedoresApi]);
      } catch (error) {
        console.error('Erro ao buscar desenvolvedores da API:', error);
      }
    }
    console.log(desenvolvedoresLocal)

    fetchDesenvolvedores();
  }, []);
  
  function excluirDev(id) {
    if (window.confirm("Deseja realmente excluir este desenvolvedor?")) {
      // Filtra a lista de desenvolvedores locais para excluir o desenvolvedor desejado
      const desenvolvedoresLocal = JSON.parse(localStorage.getItem('desenvolvedor')) || [];
      const novaLista = desenvolvedoresLocal.filter(dev => dev.id !== id);

      // Atualiza o localStorage com a nova lista
      localStorage.setItem('desenvolvedor', JSON.stringify(novaLista));

      // Atualiza o estado local 'desenvolvedores' para refletir a exclusão
      setDesenvolvedores(desenvolvedores.filter(dev => dev.id !== id));

      alert("Desenvolvedor excluído com sucesso!");
    }
  }

  function editarDev(id) {
    router.push(`/desenvolvedor/form?id=${id}`);
  }

  return (
    <Pagina titulo="Desenvolvedores">
      <div className='text-end mb-2'>
        <Button href='/desenvolvedor/form'><FaPlusCircle /> Novo</Button>
      </div>
      <Row lg={3} className="g-4">
        {desenvolvedores.map(desenvolvedor => (
          <Col key={desenvolvedor.id}>
            <Card>
              <Card.Body style={{ padding: '1.5rem', textAlign: 'center' }}>
                <Card.Title style={{ fontSize: '1.5rem', fontWeight: '600', color: '#0056b3' }}>{desenvolvedor.nome}</Card.Title>
              </Card.Body>
              <Card.Footer style={{ background: 'transparent', borderTop: 'none', padding: '1rem', textAlign: 'center' }}>
                <a 
                  href={`/desenvolvedor/${desenvolvedor.id}`} 
                  className="btn btn-primary"
                  style={{ padding: '0.5rem 1.5rem', fontSize: '1rem', fontWeight: '500', backgroundColor: '#007bff', borderColor: '#007bff', marginRight: '0.5rem' }}
                >
                  Ver Jogos
                </a>
                <Button variant="warning" onClick={() => editarDev(desenvolvedor.id)} style={{ marginRight: '0.5rem' }}><FaPen /> Editar</Button>
                <Button variant="danger" onClick={() => excluirDev(desenvolvedor.id)}><FaTrash /> Excluir</Button>
              </Card.Footer>
            </Card>
          </Col>
        ))}
      </Row>
    </Pagina>
  );
}
