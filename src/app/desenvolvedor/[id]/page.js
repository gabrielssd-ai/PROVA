'use client';

import apiJogos from '@/api/api';
import Pagina from '@/components/Pagina';
import React, { useEffect, useState } from 'react';
import { Row, Col, Card, Button, Alert } from 'react-bootstrap';
import { FaArrowLeft } from 'react-icons/fa';

export default function Page(props) {
    const id = props.params.id; 
    const [desenvolvedor, setDesenvolvedor] = useState('');
    const [jogos, setJogos] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        BuscarDesenvolvedor();
    }, []);

    useEffect(() => {
        if (desenvolvedor) {
            BuscarJogos();
        }
    }, [desenvolvedor]);

    async function BuscarDesenvolvedor() {
        const desenvolvedoresLocal = JSON.parse(localStorage.getItem('desenvolvedor')) || [];
        const desenvolvedorLocal = desenvolvedoresLocal.find(dev => dev.id === id);

        if (desenvolvedorLocal) {
            setDesenvolvedor(desenvolvedorLocal.nome);
        } else {
            try {
                const devResultado = await apiJogos.get(`/developers/${id}?key=3c9f3f7cdd874ffa985c468ad4b83467`);
                setDesenvolvedor(devResultado.data.name);
            } catch (error) {
                console.error('Erro ao buscar desenvolvedor:', error);
                setError('Desenvolvedor não encontrado.');
            }
        }
    }

    async function BuscarJogos() {
        const jogosLocal = JSON.parse(localStorage.getItem('jogos')) || [];
        
        // Filtra os jogos do desenvolvedor localmente
        const jogosDoDesenvolvedorLocal = jogosLocal.filter(jogo => jogo.desenvolvedor === desenvolvedor);

        try {
            const resultado = await apiJogos.get(`/games?developers=${id}&key=3c9f3f7cdd874ffa985c468ad4b83467`);
            const jogosApi = resultado.data.results;

            // Mescla os jogos locais com os da API
            setJogos([...jogosDoDesenvolvedorLocal, ...jogosApi]);
        } catch (error) {
            console.error('Erro ao buscar jogos:', error);
            setJogos(jogosDoDesenvolvedorLocal);  // Mostra apenas os jogos locais se a API falhar
            setError('Erro ao carregar jogos da API.');
        }
    }

    return (
        <Pagina titulo={desenvolvedor || "Detalhes do Desenvolvedor"}>
            <Button className='me-2' href='/desenvolvedor/pagina-inicial'><FaArrowLeft /> Voltar</Button>
            {error && <Alert variant="danger" className="mt-3">{error}</Alert>}
            <Row>
                {jogos.map(jogo => (
                    <Col key={jogo.id} md={4} className="mb-4 d-flex">
                        <Card className="w-100 d-flex flex-column">
                            <Card.Img 
                                src={jogo.background_image || jogo.linkImagem || '/path/to/default/image.jpg'}
                                style={{ height: '200px', objectFit: 'cover' }}
                            />
                            <Card.Body className="d-flex flex-column">
                                <Card.Title>{jogo.name || jogo.nome}</Card.Title>
                                <div className="mt-auto">
                                    <Button href={'/jogos/' + jogo.id}>
                                        Detalhes
                                    </Button>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>
        </Pagina>
    );
}
