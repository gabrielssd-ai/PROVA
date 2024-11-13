'use client'
import Pagina from '@/components/Pagina';
import React, { useEffect, useState } from 'react';
import { Button, Card, Col, Row } from 'react-bootstrap';
import { FaPen, FaPlusCircle, FaTrash } from 'react-icons/fa';
import apiJogos from "@/api/api";
import { useRouter } from 'next/navigation';

export default function Page() {
    const router = useRouter();
    const [jogos, setJogos] = useState([]);

    useEffect(() => {
        BuscarJogos();
    }, []);

    async function BuscarJogos() {
        const jogosLocal = JSON.parse(localStorage.getItem('jogos')) || [];
        const resultado = await apiJogos.get('/games?key=3c9f3f7cdd874ffa985c468ad4b83467');
        console.log(jogosLocal)
        const jogosApi = resultado.data.results;
        setJogos([...jogosLocal, ...jogosApi]);
    }
    

    function excluirJogo(id) {
        if (window.confirm("Deseja realmente excluir este jogo?")) {
            const jogosLocal = JSON.parse(localStorage.getItem('jogos')) || [];
            const novaLista = jogosLocal.filter(jogo => jogo.id !== id);
            localStorage.setItem('jogos', JSON.stringify(novaLista));
            setJogos(jogos.filter(jogo => jogo.id !== id));
            alert("Jogo excluído com sucesso!");
        }
    }

    function editarJogo(id) {
        router.push(`/jogos/form?id=${id}`);
    }

    return (
        <Pagina titulo={"Jogos"}>
            <div className='text-end mb-2'>
                <Button href='/jogos/form'><FaPlusCircle /> Novo</Button>
            </div>
            <Row md={3}>
                {jogos.map(game => (
                    <Col key={game.id} className="py-2">
                        <Card className="mb-4">
                            <Card.Img 
                                style={{ height: '400px' }} 
                                src={game.linkImagem || game.background_image || '/path/to/default/image.jpg'} 
                            />
                            <Card.Body>
                                <Card.Title>{game.name}</Card.Title>
                            </Card.Body>
                            <Card.Footer className="d-flex justify-content-around">
                                <Button variant="primary" href={'/jogos/' + game.id}>Detalhes</Button>
                                <Button variant="warning" onClick={() => editarJogo(game.id)}><FaPen /> Editar</Button>
                                <Button variant="danger" onClick={() => excluirJogo(game.id)}><FaTrash /> Excluir</Button>
                            </Card.Footer>
                        </Card>
                    </Col>
                ))}
            </Row>
        </Pagina>
    );
}
