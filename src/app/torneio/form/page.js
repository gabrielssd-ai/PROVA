'use client';

import apiJogos from '@/api/api';
import Pagina from '@/components/Pagina';
import { Formik } from 'formik';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { Button, Col, Form, Row } from 'react-bootstrap';
import { FaArrowLeft, FaCheck } from 'react-icons/fa';
import { v4 } from 'uuid';
import * as Yup from 'yup';
import InputMask from 'react-input-mask';

export default function Page(props) {
    const router = useRouter();
    const torneios = JSON.parse(localStorage.getItem('torneio')) || [];
    const gamesLocal = JSON.parse(localStorage.getItem('jogos')) || [];

    const id = props.searchParams?.id;
    const torneioEditado = torneios.find(item => item.id === id);

    const [jogos, setJogos] = useState([]);
    const [sugestoesLocalizacao, setSugestoesLocalizacao] = useState([]);

    useEffect(() => {
        const BuscarJogos = async () => {
            try {
                const resultado = await apiJogos.get('/games?key=3c9f3f7cdd874ffa985c468ad4b83467');
                const apijogos = resultado.data.results.map(games => ({
                    id: games.id,
                    nome: games.name,
                }));
                setJogos([...gamesLocal, ...apijogos]);
            } catch (error) {
                console.error("Erro ao buscar jogos da API:", error);
                setJogos(gamesLocal);
            }
        };
        BuscarJogos();
    }, []);

    function salvar(dados) {
        if (torneioEditado) {
            Object.assign(torneioEditado, dados);
            const torneiosAtualizados = torneios.map(torneio => torneio.id === id ? torneioEditado : torneio);
            localStorage.setItem('torneio', JSON.stringify(torneiosAtualizados));
        } else {
            dados.id = v4();
            torneios.push(dados);
            localStorage.setItem('torneio', JSON.stringify(torneios));
        }
        alert("Torneio salvo com sucesso!");
        router.push("/torneio");
    }

    const initialValues = torneioEditado || {
        nome: '',
        descricao: '',
        dataInicio: '',
        dataFim: '',
        jogo: '',
        numeroEquipes: '',
        premiacao: '',
        localizacao: ''
    };

    const validationSchema = Yup.object().shape({
        nome: Yup.string().required("Campo Obrigatório"),
        descricao: Yup.string().required("Campo Obrigatório"),
        dataInicio: Yup.date().required("Campo Obrigatório"),
        dataFim: Yup.date().required("Campo Obrigatório"),
        jogo: Yup.string().required("Campo Obrigatório"),
        numeroEquipes: Yup.number().min(2).max(10).required("Campo Obrigatório"),
        premiacao: Yup.string().required("Campo Obrigatório"),
        localizacao: Yup.string().required("Campo Obrigatório"),
    });

    const buscarSugestoesLocalizacao = async (texto) => {
        if (texto.length > 3) {
            const resposta = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${texto}`);
            const dados = await resposta.json();
            setSugestoesLocalizacao(dados);
        }
    };

    return (
        <Pagina titulo="Cadastro de Torneio">
            <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={salvar}
            >
                {({ values, errors, touched, handleBlur, handleChange, handleSubmit, setFieldValue }) => (
                    <Form onSubmit={handleSubmit}>
                        <Row className="mb-3">
                            <Form.Group as={Col}>
                                <Form.Label>Nome do Torneio:</Form.Label>
                                <Form.Control
                                    name="nome"
                                    type="text"
                                    value={values.nome}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    isValid={touched.nome && !errors.nome}
                                    isInvalid={touched.nome && errors.nome}
                                />
                                <Form.Control.Feedback type="invalid">{errors.nome}</Form.Control.Feedback>
                            </Form.Group>

                            <Form.Group as={Col}>
                                <Form.Label>Descrição:</Form.Label>
                                <Form.Control
                                    name="descricao"
                                    as="textarea"
                                    rows={3}
                                    value={values.descricao}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    isValid={touched.descricao && !errors.descricao}
                                    isInvalid={touched.descricao && errors.descricao}
                                />
                                <Form.Control.Feedback type="invalid">{errors.descricao}</Form.Control.Feedback>
                            </Form.Group>
                        </Row>

                        <Row className="mb-3">
                            <Form.Group as={Col}>
                                <Form.Label>Data de Início:</Form.Label>
                                <InputMask
                                    mask="99/99/9999"
                                    name="dataInicio"
                                    value={values.dataInicio}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    className={`form-control ${touched.dataInicio && errors.dataInicio ? 'is-invalid' : ''}`}
                                    placeholder="DD/MM/AAAA"
                                />
                                <Form.Control.Feedback type="invalid">{errors.dataInicio}</Form.Control.Feedback>
                            </Form.Group>

                            <Form.Group as={Col}>
                                <Form.Label>Data Final:</Form.Label>
                                <InputMask
                                    mask="99/99/9999"
                                    name="dataFim"
                                    value={values.dataFim}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    className={`form-control ${touched.dataFim && errors.dataFim ? 'is-invalid' : ''}`}
                                    placeholder="DD/MM/AAAA"
                                />
                                <Form.Control.Feedback type="invalid">{errors.dataFim}</Form.Control.Feedback>
                            </Form.Group>
                        </Row>

                        <Row className="mb-3">
                            <Form.Group as={Col}>
                                <Form.Label>Jogo:</Form.Label>
                                <Form.Select
                                    name="jogo"
                                    value={values.jogo}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    isValid={touched.jogo && !errors.jogo}
                                    isInvalid={touched.jogo && errors.jogo}
                                >
                                    <option value="">Selecione</option>
                                    {jogos.map(games => (
                                        <option key={games.id} value={games.nome}>{games.nome}</option>
                                    ))}
                                </Form.Select>
                                <Form.Control.Feedback type="invalid">{errors.jogo}</Form.Control.Feedback>
                            </Form.Group>

                            <Form.Group as={Col}>
                                <Form.Label>Número de Equipes:</Form.Label>
                                <Form.Control
                                    name="numeroEquipes"
                                    type="number"
                                    value={values.numeroEquipes}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    isValid={touched.numeroEquipes && !errors.numeroEquipes}
                                    isInvalid={touched.numeroEquipes && errors.numeroEquipes}
                                />
                                <Form.Control.Feedback type="invalid">{errors.numeroEquipes}</Form.Control.Feedback>
                            </Form.Group>
                        </Row>

                        <Row className="mb-3">
                            <Form.Group as={Col}>
                                <Form.Label>Premiação:</Form.Label>
                                <InputMask
                                    mask="R$ 99999"
                                    name="premiacao"
                                    value={values.premiacao}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    className={`form-control ${touched.premiacao && errors.premiacao ? 'is-invalid' : ''}`}
                                    placeholder="R$ 00000"
                                />
                                <Form.Control.Feedback type="invalid">{errors.premiacao}</Form.Control.Feedback>
                            </Form.Group>

                            <Form.Group as={Col}>
                                <Form.Label>Localização:</Form.Label>
                                <Form.Control
                                    name="localizacao"
                                    type="text"
                                    value={values.localizacao}
                                    onChange={(e) => {
                                        handleChange(e);
                                        buscarSugestoesLocalizacao(e.target.value);
                                    }}
                                    onBlur={handleBlur}
                                    isValid={touched.localizacao && !errors.localizacao}
                                    isInvalid={touched.localizacao && errors.localizacao}
                                    placeholder="Digite a localização do torneio"
                                />
                                <Form.Control.Feedback type="invalid">{errors.localizacao}</Form.Control.Feedback>
                                {sugestoesLocalizacao.length > 0 && (
                                    <ul style={{ listStyle: 'none', padding: 0, marginTop: '5px' }}>
                                        {sugestoesLocalizacao.map((sugestao, index) => (
                                            <li
                                                key={index}
                                                onClick={() => {
                                                    setFieldValue('localizacao', sugestao.display_name);
                                                    setSugestoesLocalizacao([]);
                                                }}
                                                style={{
                                                    cursor: 'pointer',
                                                    padding: '5px 10px',
                                                    borderBottom: '1px solid #ddd',
                                                    backgroundColor: '#f9f9f9'
                                                }}
                                            >
                                                {sugestao.display_name}
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </Form.Group>
                        </Row>

                        <Form.Group className="text-end">
                            <Button className="me-2" href="/torneio"><FaArrowLeft /> Voltar</Button>
                            <Button type="submit" variant="success"><FaCheck /> Enviar</Button>
                        </Form.Group>
                    </Form>
                )}
            </Formik>
        </Pagina>
    );
}
