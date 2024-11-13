'use client';

import { Container, Nav, Navbar, NavDropdown } from "react-bootstrap";
import Image from 'next/image';
import { useEffect, useState } from 'react';
import apiJogos from "@/api/api";

export default function Pagina({ titulo, children }) {
  const [showDropdown, setShowDropdown] = useState({
    generos: false,
  });
  const [generos, setGeneros] = useState([]);

  useEffect(() => {
    BuscarGeneros();
  }, []);

  async function BuscarGeneros() {
    const resultado = await apiJogos.get('https://api.rawg.io/api/genres?key=3c9f3f7cdd874ffa985c468ad4b83467');
    setGeneros(resultado.data.results);
  }

  return (
    <>
      <Navbar style={{ backgroundColor: '#1b1f38', padding: '10px 20px' }}>
        <Container fluid>
          <Navbar.Brand href="/" style={{ display: 'flex', alignItems: 'center', marginRight: 'auto' }}>
            <Image
              src="/foto/logo.png"
              alt="Logo"
              width={150}
              height={90}
              style={{ marginLeft: '0' }}
            />
          </Navbar.Brand>
          <Nav className="mx-auto" style={{ display: 'flex', gap: '20px' }}>

            <Navbar.Brand style={{ color: '#FFFFFF', fontWeight: 'bold', fontSize: '1.1rem' }} href="/jogos">Jogos</Navbar.Brand>

            {/* Dropdown de Gêneros */}
            <NavDropdown
              title={<span style={{ color: '#FFFFFF', fontWeight: 'bold', fontSize: '1.1rem' }}>Gêneros</span>}
              id="nav-dropdown-generos"
              show={showDropdown.generos}
              onMouseEnter={() => setShowDropdown({ generos: true })}
              onMouseLeave={() => setShowDropdown({ generos: false })}
            >
              <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
                {generos.map(genero => (
                  <NavDropdown.Item
                    key={genero.id}
                    href={`/generos/${genero.id}`}
                  >
                    {genero.name}
                  </NavDropdown.Item>
                ))}
              </div>
            </NavDropdown>

            
            <Navbar.Brand style={{ color: '#FFFFFF', fontWeight: 'bold', fontSize: '1.1rem' }} href="/desenvolvedor/pagina-inicial">
              Desenvolvedores
            </Navbar.Brand>
            
            <Navbar.Brand style={{ color: '#FFFFFF', fontWeight: 'bold', fontSize: '1.1rem' }} href="/torneio">
              Torneios
            </Navbar.Brand>

            <Navbar.Brand style={{ color: '#FFFFFF', fontWeight: 'bold', fontSize: '1.1rem' }} href="/usuarios">
              Usuários
            </Navbar.Brand>

            <Navbar.Brand style={{ color: '#FFFFFF', fontWeight: 'bold', fontSize: '1.1rem' }} href="/equipes">
              Equipes
            </Navbar.Brand>
          </Nav>
        </Container>
      </Navbar>

      <div style={{ backgroundColor: '#2e3b55', color: '#FFFFFF', textAlign: 'center', padding: '15px 0' }}>
        <h1 style={{ letterSpacing: '2px' }}>{titulo}</h1>
      </div>

      <Container className="mt-4">
        {children}
      </Container>
    </>
  );
}
