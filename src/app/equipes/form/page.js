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
import ReactInputMask from 'react-input-mask';

export default function Page(props) {
    const router = useRouter();
    const equipes = JSON.parse(localStorage.getItem('equipes')) || [];
    const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
    const torneios = JSON.parse(localStorage.getItem('torneio')) || [];
    const localJogos = JSON.parse(localStorage.getItem('jogos')) || [];
    const localDesenvolvedores = JSON.parse(localStorage.getItem('desenvolvedor')) || [];

    const id = props.searchParams?.id;
    const equipeEditada = equipes.find(item => item.id === id);

    const [desenvolvedores, setDesenvolvedores] = useState(localDesenvolvedores);
    const [jogos, setJogos] = useState(localJogos);

    useEffect(() => {
        BuscarDev();
        BuscarJogo();
    }, []);

    async function BuscarDev() {
        const resultado = await apiJogos.get('/developers?key=3c9f3f7cdd874ffa985c468ad4b83467');
        const apiDesenvolvedores = resultado.data.results.map(dev => ({
            id: dev.id,
            nome: dev.name,
        }));
        setDesenvolvedores([...localDesenvolvedores, ...apiDesenvolvedores]);
    }

    async function BuscarJogo() {
        const resultado = await apiJogos.get('/games?key=3c9f3f7cdd874ffa985c468ad4b83467');
        const apijogos = resultado.data.results.map(jogo => ({
            id: jogo.id,
            nome: jogo.name,
        }));
        setJogos([...localJogos, ...apijogos]);
    }

    function salvar(dados) {
        if (equipeEditada) {
            Object.assign(equipeEditada, dados);
            const equipesAtualizadas = equipes.map(equipe => equipe.id === id ? equipeEditada : equipe);
            localStorage.setItem('equipes', JSON.stringify(equipesAtualizadas));
        } else {
            dados.id = v4();
            equipes.push(dados);
            localStorage.setItem('equipes', JSON.stringify(equipes));
        }

        alert("Equipe salva com sucesso!");
        router.push("/equipes");
    }

    const initialValues = equipeEditada || {
        nomeEquipe: '',
        jogoPrincipal: '',
        torneiosInscritos: '',  
        capitaoEquipe: '',
        membrosEquipe: [],
        desenvolvedorFavorito: '',
        dataFundacao: '',
        descricaoEquipe: ''
    };

    const validationSchema = Yup.object().shape({
        nomeEquipe: Yup.string().required("Campo Obrigatório"),
        jogoPrincipal: Yup.string().required("Campo Obrigatório"),
        torneiosInscritos: Yup.string().optional(),  
        capitaoEquipe: Yup.string().optional(),
        membrosEquipe: Yup.array().optional(),
        desenvolvedorFavorito: Yup.string().optional(),
        dataFundacao: Yup.date().optional(),
        descricaoEquipe: Yup.string().optional(),
    });

    return (
        <Pagina titulo="Cadastro de Equipe">
            <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={salvar}
            >
                {({ values, errors, touched, handleBlur, handleChange, handleSubmit, setFieldValue }) => (
                    <Form onSubmit={handleSubmit}>
                        <Row className="mb-3">
                            <Form.Group as={Col}>
                                <Form.Label>Nome da Equipe:</Form.Label>
                                <Form.Control
                                    name="nomeEquipe"
                                    type="text"
                                    value={values.nomeEquipe}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    isValid={touched.nomeEquipe && !errors.nomeEquipe}
                                    isInvalid={touched.nomeEquipe && errors.nomeEquipe}
                                />
                                <Form.Control.Feedback type="invalid">{errors.nomeEquipe}</Form.Control.Feedback>
                            </Form.Group>

                            <Form.Group as={Col}>
                                <Form.Label>Jogo Principal:</Form.Label>
                                <Form.Select
                                    name="jogoPrincipal"
                                    value={values.jogoPrincipal}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    isValid={touched.jogoPrincipal && !errors.jogoPrincipal}
                                    isInvalid={touched.jogoPrincipal && errors.jogoPrincipal}
                                >
                                    <option value="">Selecione</option>
                                    {jogos.map(jogo => (
                                        <option key={jogo.id} value={jogo.nome}>{jogo.nome}</option>
                                    ))}
                                </Form.Select>
                                <Form.Control.Feedback type="invalid">{errors.jogoPrincipal}</Form.Control.Feedback>
                            </Form.Group>
                        </Row>

                        <Row className="mb-3">
                            <Form.Group as={Col}>
                                <Form.Label>Torneios Inscritos:</Form.Label>
                                <Form.Select
                                    name="torneiosInscritos"
                                    value={values.torneiosInscritos}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    isValid={touched.torneiosInscritos && !errors.torneiosInscritos}
                                    isInvalid={touched.torneiosInscritos && errors.torneiosInscritos}
                                >
                                    <option value="">Selecione</option>
                                    {torneios.map(torneio => (
                                        <option key={torneio.id} value={torneio.nome}>{torneio.nome}</option>
                                    ))}
                                </Form.Select>
                                <Form.Control.Feedback type="invalid">{errors.torneiosInscritos}</Form.Control.Feedback>
                            </Form.Group>

                            <Form.Group as={Col}>
                                <Form.Label>Capitão da Equipe:</Form.Label>
                                <Form.Select
                                    name="capitaoEquipe"
                                    value={values.capitaoEquipe}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    isValid={touched.capitaoEquipe && !errors.capitaoEquipe}
                                    isInvalid={touched.capitaoEquipe && errors.capitaoEquipe}
                                >
                                    <option value="">Selecione</option>
                                    {usuarios.map(usuario => (
                                        <option key={usuario.id} value={usuario.nomeCompleto}>{usuario.nomeCompleto}</option>
                                    ))}
                                </Form.Select>
                                <Form.Control.Feedback type="invalid">{errors.capitaoEquipe}</Form.Control.Feedback>
                            </Form.Group>
                        </Row>

                        <Row className="mb-3">
                            <Form.Group as={Col}>
                                <Form.Label>Membros da Equipe:</Form.Label>
                                <Form.Select
                                    name="membrosEquipe"
                                    value={values.membrosEquipe}
                                    multiple
                                    onChange={e => {
                                        const selected = Array.from(e.target.selectedOptions, option => option.value);
                                        setFieldValue("membrosEquipe", selected);
                                    }}
                                    onBlur={handleBlur}
                                    isInvalid={touched.membrosEquipe && errors.membrosEquipe}
                                >
                                    {usuarios.map(usuario => (
                                        <option key={usuario.id} value={usuario.nomeCompleto}>{usuario.nomeCompleto}</option>
                                    ))}
                                </Form.Select>
                                <Form.Control.Feedback type="invalid">{errors.membrosEquipe}</Form.Control.Feedback>
                            </Form.Group>

                            <Form.Group as={Col}>
                                <Form.Label>Desenvolvedor Favorito:</Form.Label>
                                <Form.Select
                                    name="desenvolvedorFavorito"
                                    value={values.desenvolvedorFavorito}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    isValid={touched.desenvolvedorFavorito && !errors.desenvolvedorFavorito}
                                    isInvalid={touched.desenvolvedorFavorito && errors.desenvolvedorFavorito}
                                >
                                    <option value="">Selecione</option>
                                    {desenvolvedores.map(dev => (
                                        <option key={dev.id} value={dev.nome}>{dev.nome}</option>
                                    ))}
                                </Form.Select>
                                <Form.Control.Feedback type="invalid">{errors.desenvolvedorFavorito}</Form.Control.Feedback>
                            </Form.Group>
                        </Row>

                        <Row className="mb-3">
                        <Form.Group as={Col}>
                                <Form.Label>Data de Fundação:</Form.Label>
                                <InputMask
                                    mask="99/99/9999"
                                    name="dataFundacao"
                                    value={values.dataFundacao}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    className={`form-control ${touched.dataFundacao && errors.dataFundacao ? 'is-invalid' : 'is-valid'}`}
                                />
                                <Form.Control.Feedback type="invalid">{errors.dataFundacao}</Form.Control.Feedback>
                            </Form.Group>

                            <Form.Group as={Col}>
                                <Form.Label>Descrição da Equipe:</Form.Label>
                                <Form.Control
                                    name="descricaoEquipe"
                                    as="textarea"
                                    rows={3}
                                    value={values.descricaoEquipe}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    isValid={touched.descricaoEquipe && !errors.descricaoEquipe}
                                    isInvalid={touched.descricaoEquipe && errors.descricaoEquipe}
                                />
                                <Form.Control.Feedback type="invalid">{errors.descricaoEquipe}</Form.Control.Feedback>
                            </Form.Group>
                        </Row>

                        <Form.Group className="text-end">
                            <Button className="me-2" href="/equipes"><FaArrowLeft /> Voltar</Button>
                            <Button type="submit" variant="success"><FaCheck /> Enviar</Button>
                        </Form.Group>
                    </Form>
                )}
            </Formik>
        </Pagina>
    );
}
