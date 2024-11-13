'use client';

import Pagina from '@/components/Pagina';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Button, Table, Badge } from 'react-bootstrap';
import { FaArrowLeft, FaPen, FaPlusCircle, FaTrash } from 'react-icons/fa';

export default function Page() {
  const router = useRouter();
  const [equipes, setEquipes] = useState([]);

  useEffect(() => {
    const equipesLocalStorage = JSON.parse(localStorage.getItem("equipes")) || [];
    setEquipes(equipesLocalStorage);
  }, []);

  function excluir(equipe) {
    if (window.confirm(`Deseja realmente excluir a equipe ${equipe.nomeEquipe}?`)) {
      const novaLista = equipes.filter(item => item.id !== equipe.id);
      localStorage.setItem('equipes', JSON.stringify(novaLista));
      setEquipes(novaLista);
      alert("Equipe excluída com sucesso!");
    }
  }

  function editarEquipe(id) {
    router.push(`/equipes/form?id=${id}`);
  }

  return (
    <Pagina titulo={"Lista de Equipes"}>
      <div>
        <Button className="me-2" href="/equipes"><FaArrowLeft /> Voltar</Button>
      </div>
      <div className="text-end mb-2">
        <Badge bg="secondary">Total de Equipes: {equipes.length}</Badge>
        <Button href='/equipes/form' className="ms-2"><FaPlusCircle /> Nova Equipe</Button>
      </div>

      <Table striped bordered hover responsive style={{ backgroundColor: '#f9f9f9' }}>
        <thead style={{ backgroundColor: '#2e3b55', color: '#fff', textAlign: 'center' }}>
          <tr>
            <th>Nome da Equipe</th>
            <th>Jogo Principal</th>
            <th>Torneios Inscritos</th>
            <th>Capitão</th>
            <th>Membros</th>
            <th>Desenvolvedor Favorito</th>
            <th>Data de Fundação</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {equipes.map(equipe => (
            <tr key={equipe.id} style={{ textAlign: 'center', verticalAlign: 'middle' }}>
              <td>{equipe.nomeEquipe}</td>
              <td>{equipe.jogoPrincipal}</td>
              <td>{equipe.torneiosInscritos || 'Nenhum'}</td>
              <td>{equipe.capitaoEquipe}</td>
              <td>{Array.isArray(equipe.membrosEquipe) ? equipe.membrosEquipe.join(', ') : 'Nenhum'}</td>
              <td>{equipe.desenvolvedorFavorito}</td>
              <td>{new Date(equipe.dataFundacao).toLocaleDateString()}</td>
              <td>
                <Button variant="primary" className='me-2' onClick={() => editarEquipe(equipe.id)}>
                  <FaPen />
                </Button>
                <Button variant="danger" onClick={() => excluir(equipe)}>
                  <FaTrash />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Pagina>
  );
}
