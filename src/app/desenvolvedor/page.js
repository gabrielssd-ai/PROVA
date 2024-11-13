'use client';

import Pagina from '@/components/Pagina';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Button, Table } from 'react-bootstrap';
import { FaArrowLeft, FaPen, FaPlusCircle, FaTrash } from 'react-icons/fa';

export default function Page() {
  const router = useRouter();
  const [desenvolvedores, setDesenvolvedores] = useState([]);

  useEffect(() => {
    const desenvolvedoresLocalStorage = JSON.parse(localStorage.getItem("desenvolvedor")) || [];
    setDesenvolvedores(desenvolvedoresLocalStorage);
  }, []);

  function excluir(desenvolvedor) {
    if (window.confirm(`Deseja realmente excluir o desenvolvedor ${desenvolvedor.nome}?`)) {
      const novaLista = desenvolvedores.filter(item => item.id !== desenvolvedor.id);
      localStorage.setItem('desenvolvedor', JSON.stringify(novaLista));
      setDesenvolvedores(novaLista);
      alert("Desenvolvedor excluído com sucesso!");
    }
  }

  function editarDesenvolvedor(id) {
    router.push(`/desenvolvedor/form?id=${id}`);
  }

  return (
    <Pagina titulo={"Lista de Desenvolvedores"}>
      <div>
      <Button className="me-2" href="/desenvolvedor/pagina-inicial"><FaArrowLeft /> Voltar</Button>
      </div>
      <div className='text-end mb-2'>
        <Button href='/desenvolvedor/form'><FaPlusCircle /> Novo</Button>
      </div>

      <Table striped bordered hover responsive style={{
        backgroundColor: '#f9f9f9',
        borderCollapse: 'collapse',
        width: '100%'
      }}>
        <thead style={{ backgroundColor: '#2e3b55', color: '#fff', textAlign: 'center' }}>
          <tr>
            <th>Nome</th>
            <th>Data de Fundação</th>
            <th>País de Origem</th>
            <th>Descrição</th>
            <th>Fundador</th>
            <th>Áreas de Especialização</th>
            <th>Prêmios Recebidos</th>
            <th>Número de Funcionários</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {desenvolvedores.map(desenvolvedor => (
            <tr key={desenvolvedor.id} style={{ textAlign: 'center', verticalAlign: 'middle' }}>
              <td>{desenvolvedor.nome}</td>
              <td>{new Date(desenvolvedor.fundacao).toLocaleDateString()}</td>
              <td>{desenvolvedor.paisOrigem}</td>
              <td>{desenvolvedor.descricao}</td>
              <td>{desenvolvedor.fundadores}</td>
              <td>{desenvolvedor.areasEspecializacao}</td>
              <td>{desenvolvedor.premiosRecebidos}</td>
              <td>{desenvolvedor.numeroFuncionarios}</td>
              <td style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Button
                  className='me-2'
                  variant="primary"
                  onClick={() => editarDesenvolvedor(desenvolvedor.id)}
                  style={{ marginRight: '5px' }}
                >
                  <FaPen />
                </Button>
                <Button
                  variant='danger'
                  onClick={() => excluir(desenvolvedor)}
                >
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
