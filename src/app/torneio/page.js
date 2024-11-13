'use client';

import Pagina from '@/components/Pagina';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Button, Table, Badge } from 'react-bootstrap';
import { FaArrowLeft, FaPen, FaPlusCircle, FaTrash } from 'react-icons/fa';

export default function Page() {
  const router = useRouter();
  const [torneios, setTorneios] = useState([]);

  useEffect(() => {
    const torneiosLocalStorage = JSON.parse(localStorage.getItem("torneio")) || [];
    setTorneios(torneiosLocalStorage);
  }, []);

  function excluir(torneio) {
    if (window.confirm(`Deseja realmente excluir o torneio ${torneio.nome}?`)) {
      const novaLista = torneios.filter(item => item.id !== torneio.id);
      localStorage.setItem('torneio', JSON.stringify(novaLista));
      setTorneios(novaLista);
      alert("Torneio excluído com sucesso!");
    }
  }

  function editarTorneio(id) {
    router.push(`/torneio/form?id=${id}`);
  }

  return (
    <Pagina titulo={"Lista de Torneios"}>
      <div>
        <Button className="me-2" href="/torneio"><FaArrowLeft /> Voltar</Button>
      </div>
      <div className="text-end mb-2">
        <Badge bg="secondary">Total de Torneios: {torneios.length}</Badge>
        <Button href='/torneio/form' className="ms-2"><FaPlusCircle /> Novo Torneio</Button>
      </div>

      <Table striped bordered hover responsive style={{ backgroundColor: '#f9f9f9' }}>
        <thead style={{ backgroundColor: '#2e3b55', color: '#fff', textAlign: 'center' }}>
          <tr>
            <th>Nome</th>
            <th>Descrição</th>
            <th>Data de Início</th>
            <th>Data Final</th>
            <th>Jogo</th>
            <th>Número de Equipes</th>
            <th>Premiação</th>
            <th>Localização</th>
            <th>Status</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {torneios.map(torneio => (
            <tr key={torneio.id} style={{ textAlign: 'center', verticalAlign: 'middle' }}>
              <td>{torneio.nome}</td>
              <td>{torneio.descricao}</td>
              <td>{new Date(torneio.dataInicio).toLocaleDateString()}</td>
              <td>{new Date(torneio.dataFim).toLocaleDateString()}</td>
              <td>{torneio.jogo}</td>
              <td>{torneio.numeroEquipes}</td>
              <td>{torneio.premiacao}</td>
              <td>{torneio.localizacao}</td>
              <td>{torneio.status || 'N/A'}</td>
              <td>
                <Button variant="primary" className='me-2' onClick={() => editarTorneio(torneio.id)}>
                  <FaPen />
                </Button>
                <Button variant="danger" onClick={() => excluir(torneio)}>
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
