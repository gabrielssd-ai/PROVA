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
    const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
    const localJogos = JSON.parse(localStorage.getItem('jogos')) || [];
    const localDesenvolvedores = JSON.parse(localStorage.getItem('desenvolvedor')) || [];
    const localGeneros = JSON.parse(localStorage.getItem('generos')) || [];
    const torneios = JSON.parse(localStorage.getItem('torneio')) || [];
    const equipes = JSON.parse(localStorage.getItem('equipes')) || [];

    const id = props.searchParams?.id;
    const usuarioEditado = usuarios.find(item => item.id === id);

    const [desenvolvedores, setDesenvolvedores] = useState(localDesenvolvedores);
    const [generos, setGeneros] = useState(localGeneros);
    const [jogos, setJogos] = useState(localJogos);

    useEffect(() => {
        BuscarDev();
        BuscarGenre();
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

    async function BuscarGenre() {
        const resultado = await apiJogos.get('/genres?key=3c9f3f7cdd874ffa985c468ad4b83467');
        const apiGeneros = resultado.data.results.map(genero => ({
            id: genero.id,
            nome: genero.name,
        }));
        setGeneros([...localGeneros, ...apiGeneros]);
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
        if (usuarioEditado) {
            Object.assign(usuarioEditado, dados);
            const usuariosAtualizados = usuarios.map(usuario => usuario.id === id ? usuarioEditado : usuario);
            localStorage.setItem('usuarios', JSON.stringify(usuariosAtualizados));
        } else {
            dados.id = v4();
            usuarios.push(dados);
            localStorage.setItem('usuarios', JSON.stringify(usuarios));
        }

        alert("Usuário salvo com sucesso!");
        router.push("/usuarios");
    }

    const initialValues = usuarioEditado || {
        nomeCompleto: '',
        dataNascimento: '',
        jogoFavorito: '',
        generoPreferido: '',
        equipe: '',
        desenvolvedorFavorito: '',
        torneiosParticipados: [],
        email: ''
    };

    const validationSchema = Yup.object().shape({
        nomeCompleto: Yup.string().required("Campo Obrigatório"),
        dataNascimento: Yup.date().required("Campo Obrigatório"),
        jogoFavorito: Yup.string().required("Campo Obrigatório"),
        generoPreferido: Yup.string().required("Campo Obrigatório"),
        equipe: Yup.string().optional(),
        desenvolvedorFavorito: Yup.string().required("Campo Obrigatório"),
        torneiosParticipados: Yup.string().required("Campo Obrigatório"),
        email: Yup.string().email("E-mail inválido").required("Campo Obrigatório"),
    });

    return (
        <Pagina titulo="Cadastro de Usuário">
            <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={salvar}
            >
                {({ values, errors, touched, handleBlur, handleChange, handleSubmit }) => (
                    <Form onSubmit={handleSubmit}>
                        <Row className="mb-3">
                            <Form.Group as={Col}>
                                <Form.Label>Nome Completo:</Form.Label>
                                <Form.Control
                                    name="nomeCompleto"
                                    type="text"
                                    value={values.nomeCompleto}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    isValid={touched.nomeCompleto && !errors.nomeCompleto}
                                    isInvalid={touched.nomeCompleto && errors.nomeCompleto}
                                />
                                <Form.Control.Feedback type="invalid">{errors.nomeCompleto}</Form.Control.Feedback>
                            </Form.Group>

                            <Form.Group as={Col}>
                                <Form.Label>Data de Nascimento:</Form.Label>
                                <Form.Control as={ReactInputMask}
                                   mask="9999/99/99"
                                   name="dataNascimento"
                                   value={values.dataNascimento}
                                   onChange={handleChange}
                                   onBlur={handleBlur}
                                   isValid={touched.dataNascimento && !errors.dataNascimento}
                                   isInvalid={touched.dataNascimento && errors.dataNascimento}
                                />
                                <Form.Control.Feedback type="invalid">{errors.dataNascimento}</Form.Control.Feedback>
                            </Form.Group>
                        </Row>

                        <Row className="mb-3">
                            <Form.Group as={Col}>
                                <Form.Label>Jogo Favorito:</Form.Label>
                                <Form.Select
                                    name="jogoFavorito"
                                    value={values.jogoFavorito}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    isValid={touched.jogoFavorito && !errors.jogoFavorito}
                                    isInvalid={touched.jogoFavorito && errors.jogoFavorito}
                                >
                                    <option value="">Selecione</option>
                                    {jogos.map(jogo => (
                                        <option key={jogo.id} value={jogo.nome}>{jogo.nome}</option>
                                    ))}
                                </Form.Select>
                                <Form.Control.Feedback type="invalid">{errors.jogoFavorito}</Form.Control.Feedback>
                            </Form.Group>

                            <Form.Group as={Col}>
                                <Form.Label>Gênero de Jogo Preferido:</Form.Label>
                                <Form.Select
                                    name="generoPreferido"
                                    value={values.generoPreferido}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    isValid={touched.generoPreferido && !errors.generoPreferido}
                                    isInvalid={touched.generoPreferido && errors.generoPreferido}
                                >
                                    <option value="">Selecione</option>
                                    {generos.map(genero => (
                                        <option key={genero.id} value={genero.nome}>{genero.nome}</option>
                                    ))}
                                </Form.Select>
                                <Form.Control.Feedback type="invalid">{errors.generoPreferido}</Form.Control.Feedback>
                            </Form.Group>
                        </Row>

                        <Row className="mb-3">
                            <Form.Group as={Col}>
                                <Form.Label>Equipe:</Form.Label>
                                <Form.Select
                                    name="equipe"
                                    value={values.equipe}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    isValid={touched.equipe && !errors.equipe}
                                    isInvalid={touched.equipe && errors.equipe}
                                >
                                    <option value="">Selecione</option>
                                    {equipes.map(equipe => (
                                        <option key={equipe.id} value={equipe.nomeEquipe}>{equipe.nomeEquipe}</option>
                                    ))}
                                </Form.Select>
                                <Form.Control.Feedback type="invalid">{errors.equipe}</Form.Control.Feedback>
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
                                <Form.Label>Torneios Participados:</Form.Label>
                                <Form.Select
                                    name="torneiosParticipados"
                                    value={values.torneiosParticipados}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    isValid={touched.torneiosParticipados && !errors.torneiosParticipados}
                                    isInvalid={touched.torneiosParticipados && errors.torneiosParticipados}
                                >
                                    <option value="">Selecione os torneios</option>
                                    {torneios.map(torneio => (
                                        <option key={torneio.id} value={torneio.nome}>{torneio.nome}</option>
                                    ))}
                                </Form.Select>
                                <Form.Control.Feedback type="invalid">{errors.torneiosParticipados}</Form.Control.Feedback>
                            </Form.Group>

                            <Form.Group as={Col}>
                                <Form.Label>E-mail:</Form.Label>
                                <Form.Control
                                    name="email"
                                    type="email"
                                    value={values.email}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    isValid={touched.email && !errors.email}
                                    isInvalid={touched.email && errors.email}
                                />
                                <Form.Control.Feedback type="invalid">{errors.email}</Form.Control.Feedback>
                            </Form.Group>
                        </Row>

                        <Form.Group className="text-end">
                            <Button className="me-2" href="/usuarios"><FaArrowLeft /> Voltar</Button>
                            <Button type="submit" variant="success"><FaCheck /> Enviar</Button>
                        </Form.Group>
                    </Form>
                )}
            </Formik>
        </Pagina>
    );
}
