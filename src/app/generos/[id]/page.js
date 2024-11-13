'use client';

import apiJogos from '@/api/api';
import Pagina from '@/components/Pagina';
import React, { useEffect, useState } from 'react';
import { Button, Card, Col, Row } from 'react-bootstrap';

export default function Page(props) {
    const id = props.params.id;
    const [jogos, setJogos] = useState([]);
    const [generoNome, setGeneroNome] = useState('');

    useEffect(() => {
        BuscarJogosDoGenero();
    }, []);

    async function BuscarJogosDoGenero() {
        try {
            // Busca o nome do gênero com base no ID para exibir na página e filtrar corretamente os jogos locais
            const generoResultado = await apiJogos.get(`/genres/${id}?key=3c9f3f7cdd874ffa985c468ad4b83467`);
            const generoNomeAPI = generoResultado.data.name;
            setGeneroNome(generoNomeAPI);

            // Busca os jogos da API que correspondem ao gênero selecionado
            const resultado = await apiJogos.get(`/games?genres=${id}&key=3c9f3f7cdd874ffa985c468ad4b83467`);
            const jogosApi = resultado.data.results;

            // Carrega os jogos locais do `localStorage`
            const jogosLocal = JSON.parse(localStorage.getItem('jogos')) || [];

            // Filtra os jogos locais que correspondem ao nome do gênero selecionado
            const jogosDoGeneroLocal = jogosLocal.filter(jogo => jogo.genero === generoNomeAPI);

            // Mescla os jogos locais com os da API
            setJogos([...jogosDoGeneroLocal, ...jogosApi]);
        } catch (error) {
            console.error("Erro ao buscar os jogos:", error);
        }
    }

    return (
        <Pagina titulo={`Jogos do Gênero: ${generoNome}`}>
            <Row>
                {jogos.map(jogo => (
                    <Col key={jogo.id} md={4} className="mb-4">
                        <Card>
                            <Card.Img src={jogo.background_image || jogo.linkImagem} />
                            <Card.Body>
                                <Card.Title>{jogo.name || jogo.nome}</Card.Title>
                                <Card.Footer>
                                    <Button href={'/jogos/' + jogo.id}>Detalhes</Button>
                                </Card.Footer>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>
        </Pagina>
    );
}
