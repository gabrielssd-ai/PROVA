'use client';

import React, { useEffect, useState } from 'react';
import { Carousel, Container, Row, Col, Card, Button } from 'react-bootstrap';
import Link from 'next/link';
import Pagina from '@/components/Pagina';
import apiJogos from '@/api/api';
import Dashboard from '@/components/Dashboard'; // Importe o componente Dashboard

export default function HomePage() {
    const [jogosDestaque, setJogosDestaque] = useState([]);
    const [jogosPopulares, setJogosPopulares] = useState([]);
    const [torneios, setTorneios] = useState([]);

    useEffect(() => {
        fetchDestaques();
        fetchJogosPopulares();
        fetchTorneios();
    }, []);

    async function fetchDestaques() {
        try {
            const resultado = await apiJogos.get('/games?ordering=-added&key=3c9f3f7cdd874ffa985c468ad4b83467');
            setJogosDestaque(resultado.data.results.slice(0, 5)); // Exibe os 5 primeiros
        } catch (error) {
            console.error('Erro ao buscar jogos em destaque:', error);
        }
    }

    async function fetchJogosPopulares() {
        try {
            const resultado = await apiJogos.get('/games?ordering=-rating&key=3c9f3f7cdd874ffa985c468ad4b83467');
            setJogosPopulares(resultado.data.results.slice(4, 10)); // Exibe os 6 primeiros
        } catch (error) {
            console.error('Erro ao buscar jogos populares:', error);
        }
    }

    async function fetchTorneios() {
        const localTorneios = JSON.parse(localStorage.getItem('torneio')) || [];
        setTorneios(localTorneios.slice(0, 3)); 
    }

    return (
        <Pagina titulo="Bem-vindo ao Portal de Jogos!">
            <Container>
                <h2 className="my-4">Destaques</h2>
                <Carousel>
                    {jogosDestaque.map(jogo => (
                        <Carousel.Item key={jogo.id}>
                            <img
                                className="d-block w-100"
                                src={jogo.background_image || '/path/to/default/image.jpg'}
                                alt={jogo.name}
                                style={{ height: '400px', objectFit: 'cover' }}
                            />
                            <Carousel.Caption>
                                <h3>{jogo.name}</h3>
                                <Link href={`/jogos/${jogo.id}`}>
                                    <Button variant="primary">Ver Detalhes</Button>
                                </Link>
                            </Carousel.Caption>
                        </Carousel.Item>
                    ))}
                </Carousel>

                <h2 className="my-4">Jogos Populares</h2>
                <Row>
                    {jogosPopulares.map(jogo => (
                        <Col key={jogo.id} md={4} className="mb-4">
                            <Card>
                                <Card.Img 
                                    variant="top" 
                                    src={jogo.background_image || '/path/to/default/image.jpg'} 
                                    style={{ height: '200px', objectFit: 'cover' }}
                                />
                                <Card.Body>
                                    <Card.Title>{jogo.name}</Card.Title>
                                    <Link href={`/jogos/${jogo.id}`}>
                                        <Button variant="primary" block>Ver Detalhes</Button>
                                    </Link>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row>

                <h2 className="my-4">Próximos Torneios</h2>
                <Row>
                    {torneios.map(torneio => (
                        <Col key={torneio.id} md={4} className="mb-4">
                            <Card>
                                <Card.Body>
                                    <Card.Title>{torneio.nome}</Card.Title>
                                    <p><b>Data de Início:</b> {new Date(torneio.dataInicio).toLocaleDateString()}</p>
                                    <p><b>Jogo:</b> {torneio.jogo}</p>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row>

                <h2 className="my-4">Estatísticas do Portal</h2>
                <Dashboard />
            </Container>
        </Pagina>
    );
}
