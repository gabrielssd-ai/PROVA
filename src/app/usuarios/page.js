'use client';

import Pagina from '@/components/Pagina';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Button, Table, Badge } from 'react-bootstrap';
import { FaArrowLeft, FaPen, FaPlusCircle, FaTrash, FaUser } from 'react-icons/fa';

export default function Page() {
  const router = useRouter();
  const [usuarios, setUsuarios] = useState([]);

  useEffect(() => {
    const usuariosLocalStorage = JSON.parse(localStorage.getItem("usuarios")) || [];
    setUsuarios(usuariosLocalStorage);
  }, []);

  function excluir(usuario) {
    if (window.confirm(`Deseja realmente excluir o usuário ${usuario.nomeCompleto}?`)) {
      const novaLista = usuarios.filter(item => item.id !== usuario.id);
      localStorage.setItem('usuarios', JSON.stringify(novaLista));
      setUsuarios(novaLista);
      alert("Usuário excluído com sucesso!");
    }
  }

  function editarUsuario(id) {
    router.push(`/usuarios/form?id=${id}`);
  }

  return (
    <Pagina titulo={"Lista de Usuários"}>
      <div>
        <Button className="me-2" href="/usuarios"><FaArrowLeft /> Voltar</Button>
      </div>
      <div className="text-end mb-2">
        <Badge bg="secondary">Total de Usuários: {usuarios.length}</Badge>
        <Button href='/usuarios/form' className="ms-2"><FaPlusCircle /> Novo Usuário</Button>
      </div>

      <Table striped bordered hover responsive style={{ backgroundColor: '#f9f9f9' }}>
        <thead style={{ backgroundColor: '#2e3b55', color: '#fff', textAlign: 'center' }}>
          <tr>
            <th>Nome Completo</th>
            <th>Data de Nascimento</th>
            <th>Gênero Preferido</th>
            <th>Jogo Favorito</th>
            <th>Equipe</th>
            <th>Desenvolvedor Favorito</th>
            <th>Torneios Participados</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {usuarios.map(usuario => (
            <tr key={usuario.id} style={{ textAlign: 'center', verticalAlign: 'middle' }}>
              <td>{usuario.nomeCompleto}</td>
              <td>{new Date(usuario.dataNascimento).toLocaleDateString()}</td>
              <td>{usuario.generoPreferido}</td>
              <td>{usuario.jogoFavorito}</td>
              <td>{usuario.equipe}</td>
              <td>{usuario.desenvolvedorFavorito}</td>
              <td>{Array.isArray(usuario.torneiosParticipados) ? usuario.torneiosParticipados.join(', ') : usuario.torneiosParticipados || 'Nenhum'}</td>
              <td>
                <Button variant="primary" className='me-2' onClick={() => editarUsuario(usuario.id)}>
                  <FaPen />
                </Button>
                <Button variant="danger" onClick={() => excluir(usuario)}>
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
