'use client';

import apiJogos from '@/api/api';
import Pagina from '@/components/Pagina';
import { useEffect, useState } from 'react';
import { Card, Col, Row } from 'react-bootstrap';

export default function Page(props) {
    const id = props.params.id;
    const [jogo, setJogo] = useState(null);
    const [trailer, setTrailer] = useState(null);

    useEffect(() => {
        BuscarJogo();
        BuscarTrailer();
    }, []);

    async function BuscarJogo() {
        const jogosLocal = JSON.parse(localStorage.getItem('jogos')) || [];
        const jogoLocal = jogosLocal.find(jogo => jogo.id === id);

        if (jogoLocal) {
            setJogo(jogoLocal);
        } else {
            try {
                const resultado = await apiJogos.get(`/games/${id}?key=3c9f3f7cdd874ffa985c468ad4b83467`);
                setJogo(resultado.data);
            } catch (error) {
                console.error('Erro ao buscar jogo da API:', error);
            }
        }
    }

    async function BuscarTrailer() {
        try {
            const resultado = await apiJogos.get(`/games/${id}/movies?key=3c9f3f7cdd874ffa985c468ad4b83467`);
            setTrailer(resultado.data.results[0]);
        } catch (error) {
            console.error('Erro ao buscar trailer:', error);
            setTrailer(null);
        }
    }

    return (
        <Pagina titulo={jogo?.name || "Detalhes do Jogo"}>
            {jogo && (
                <>
                    <Row className="align-items-center">
                        <Col md={6}>
                            <Card.Img 
                                src={jogo.linkImagem || jogo.background_image || '/path/to/default/image.jpg'} 
                                alt={jogo.name || "Imagem do Jogo"} 
                                style={{ width: '100%', borderRadius: '8px' }} 
                            />
                        </Col>
                        <Col md={6}>
                            <div style={{ lineHeight: '1.8' }}>
                                <p><b>Nome:</b> {jogo.name || jogo.nome}</p>
                                <p><b>Gênero:</b> {jogo.genres?.map(genre => genre.name).join(', ') || jogo.genero}</p>
                                <p><b>Desenvolvedores:</b> {jogo.developers?.map(dev => dev.name).join(', ') || jogo.desenvolvedor}</p>
                                <p><b>Data de Lançamento:</b> {new Date(jogo.released || jogo.dataLancamento).toLocaleDateString()}</p>
                                <p><b>Classificação Etária:</b> {jogo.esrb_rating?.name || jogo.classificacaoEtaria || 'N/A'}</p>
                                <p><b>Plataformas:</b> {jogo.platforms?.map(platform => platform.platform.name).join(', ') || jogo.plataformas}</p>
                                <p><b>Nota:</b> {jogo.rating || jogo.nota || 'N/A'}</p>
                            </div>
                        </Col>
                    </Row>
                    <hr />

                    {trailer && (
                        <div>
                            <h1 className="text-center">Trailer:</h1>
                            <video width="100%" controls>
                                <source src={trailer.data[480]} type="video/mp4" />
                                Seu navegador não suporta vídeos HTML5.
                            </video>
                        </div>
                    )}
                </>
            )}
        </Pagina>
    );
}
