'use client';

import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Badge } from 'react-bootstrap';
import { PieChart, Pie, Cell, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend } from 'recharts';

const Dashboard = () => {
    const [usuarios, setUsuarios] = useState([]);
    const [equipes, setEquipes] = useState([]);
    const [torneios, setTorneios] = useState([]);

    useEffect(() => {
        setUsuarios(JSON.parse(localStorage.getItem("usuarios")) || []);
        setEquipes(JSON.parse(localStorage.getItem("equipes")) || []);
        setTorneios(JSON.parse(localStorage.getItem("torneio")) || []);
    }, []);

    const generoData = usuarios.reduce((acc, usuario) => {
        const genero = usuario.generoPreferido || 'Indefinido';
        acc[genero] = acc[genero] ? acc[genero] + 1 : 1;
        return acc;
    }, {});
    const generoChartData = Object.keys(generoData).map(key => ({ name: key, value: generoData[key] }));
    const torneiosData = torneios.map(torneio => ({
        name: torneio.nome,
        equipes: torneio.numeroEquipes || 0,
    }));

    return (
        <Container>
            <h1 className="my-4">Dashboard de Estatísticas</h1>

            <Row className="mb-4">
                <Col>
                    <Card>
                        <Card.Body>
                            <Card.Title>Total de Usuários</Card.Title>
                            <h2><Badge bg="primary">{usuarios.length}</Badge></h2>
                        </Card.Body>
                    </Card>
                </Col>
                <Col>
                    <Card>
                        <Card.Body>
                            <Card.Title>Total de Equipes</Card.Title>
                            <h2><Badge bg="success">{equipes.length}</Badge></h2>
                        </Card.Body>
                    </Card>
                </Col>
                <Col>
                    <Card>
                        <Card.Body>
                            <Card.Title>Total de Torneios</Card.Title>
                            <h2><Badge bg="warning">{torneios.length}</Badge></h2>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            <Row className="mb-4">
                <Col md={6}>
                    <h3>Distribuição de Gêneros de Jogo Preferidos</h3>
                    <PieChart width={400} height={400}>
                        <Pie
                            data={generoChartData}
                            dataKey="value"
                            nameKey="name"
                            cx="50%"
                            cy="50%"
                            outerRadius={150}
                            fill="#8884d8"
                        >
                            {generoChartData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={['#0088FE', '#00C49F', '#FFBB28', '#FF8042'][index % 4]} />
                            ))}
                        </Pie>
                        <Tooltip />
                    </PieChart>
                </Col>

                <Col md={6}>
                    <h3>Participação das Equipes nos Torneios</h3>
                    <BarChart width={500} height={300} data={torneiosData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="equipes" fill="#82ca9d" />
                    </BarChart>
                </Col>
            </Row>
        </Container>
    );
};

export default Dashboard;
