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
    const jogos = JSON.parse(localStorage.getItem('jogos')) || [];
    const localDesenvolvedores = JSON.parse(localStorage.getItem('desenvolvedor')) || [];
    const localGeneros = JSON.parse(localStorage.getItem('generos')) || [];

    const id = props.searchParams?.id;
    const jogoEditado = jogos.find(item => item.id === id);

    const [desenvolvedores, setDesenvolvedores] = useState(localDesenvolvedores);
    const [generos, setGeneros] = useState(localGeneros);

    useEffect(() => {
        BuscarDev();
        BuscarGenre();
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

    function salvar(dados) {
        if (jogoEditado) {
            Object.assign(jogoEditado, dados);
            const jogosAtualizados = jogos.map(jogo => jogo.id === id ? jogoEditado : jogo);
            localStorage.setItem('jogos', JSON.stringify(jogosAtualizados));
        } else {
            dados.id = v4();
            jogos.push(dados);
            localStorage.setItem('jogos', JSON.stringify(jogos));
        }

        alert("Jogo salvo com sucesso!");
        router.push("/jogos");
    }

    const initialValues = jogoEditado || {
        nome: '',
        nota: '',
        genero: '',
        desenvolvedor: '',
        dataLancamento: '',
        plataformas: '',
        linkImagem: '',
        classificacaoEtaria: ''
    };

    const validationSchema = Yup.object().shape({
        nome: Yup.string().required("Campo Obrigatório"),
        nota: Yup.number().min(0).max(10).required("Campo Obrigatório"),
        genero: Yup.string().required("Campo Obrigatório"),
        desenvolvedor: Yup.string().required("Campo Obrigatório"),
        dataLancamento: Yup.date().required("Campo Obrigatório"),
        plataformas: Yup.string().required("Campo Obrigatório"),
        linkImagem: Yup.string().url("Deve ser uma URL válida").required("Campo Obrigatório"),
        classificacaoEtaria: Yup.string().required("Campo Obrigatório"),
    });

    return (
        <Pagina titulo="Cadastro de Jogo">
            <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={salvar}
            >
                {({ values, errors, touched, handleBlur, handleChange, handleSubmit }) => (
                    <Form onSubmit={handleSubmit}>
                        <Row className="mb-3">
                            <Form.Group as={Col}>
                                <Form.Label>Nome do Jogo:</Form.Label>
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
                                <Form.Label>Nota:</Form.Label>
                                <Form.Control as={ReactInputMask}
                                   mask="9.9"
                                   name="nota"
                                   value={values.nota}
                                   onChange={handleChange}
                                   onBlur={handleBlur}
                                   isValid={touched.nota && !errors.nota}
                                   isInvalid={touched.nota && errors.nota}
                                />
                                <Form.Control.Feedback type="invalid">{errors.nota}</Form.Control.Feedback>
                            </Form.Group>
                        </Row>

                        <Row className="mb-3">
                            <Form.Group as={Col}>
                                <Form.Label>Gênero:</Form.Label>
                                <Form.Select
                                    name="genero"
                                    value={values.genero}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    isValid={touched.genero && !errors.genero}
                                    isInvalid={touched.genero && errors.genero}
                                >
                                    <option value="">Selecione</option>
                                    {generos.map(genero => (
                                        <option key={genero.id} value={genero.nome}>{genero.nome}</option>
                                    ))}
                                </Form.Select>
                                <Form.Control.Feedback type="invalid">{errors.genero}</Form.Control.Feedback>
                            </Form.Group>

                            <Form.Group as={Col}>
                                <Form.Label>Desenvolvedor:</Form.Label>
                                <Form.Select
                                    name="desenvolvedor"
                                    value={values.desenvolvedor}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    isValid={touched.desenvolvedor && !errors.desenvolvedor}
                                    isInvalid={touched.desenvolvedor && errors.desenvolvedor}
                                >
                                    <option value="">Selecione</option>
                                    {desenvolvedores.map(dev => (
                                        <option key={dev.id} value={dev.nome}>{dev.nome}</option>
                                    ))}
                                </Form.Select>
                                <Form.Control.Feedback type="invalid">{errors.desenvolvedor}</Form.Control.Feedback>
                            </Form.Group>
                        </Row>

                        <Row className="mb-3">
                            <Form.Group as={Col}>
                                <Form.Label>Data de Lançamento:</Form.Label>
                                <Form.Control as={ReactInputMask}
                                   mask="9999/99/99"
                                   name="dataLancamento"
                                   value={values.dataLancamento}
                                   onChange={handleChange}
                                   onBlur={handleBlur}
                                   isValid={touched.dataLancamento && !errors.dataLancamento}
                                   isInvalid={touched.dataLancamento && errors.dataLancamento}
                                />
                                <Form.Control.Feedback type="invalid">{errors.dataLancamento}</Form.Control.Feedback>
                            </Form.Group>

                            <Form.Group as={Col}>
                                <Form.Label>Plataformas Disponíveis:</Form.Label>
                                <Form.Control
                                    name="plataformas"
                                    type="text"
                                    placeholder="Ex: PC, Console"
                                    value={values.plataformas}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    isValid={touched.plataformas && !errors.plataformas}
                                    isInvalid={touched.plataformas && errors.plataformas}
                                />
                                <Form.Control.Feedback type="invalid">{errors.plataformas}</Form.Control.Feedback>
                            </Form.Group>
                        </Row>

                        <Row className="mb-3">
                            <Form.Group as={Col}>
                                <Form.Label>Link da Imagem:</Form.Label>
                                <Form.Control
                                    name="linkImagem"
                                    type="url"
                                    value={values.linkImagem}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    isValid={touched.linkImagem && !errors.linkImagem}
                                    isInvalid={touched.linkImagem && errors.linkImagem}
                                />
                                <Form.Control.Feedback type="invalid">{errors.linkImagem}</Form.Control.Feedback>
                            </Form.Group>

                            <Form.Group as={Col}>
                                <Form.Label>Classificação Etária:</Form.Label>
                                <Form.Control as={ReactInputMask}
                                   mask="9.9"
                                   name="classificacaoEtaria"
                                   value={values.classificacaoEtaria}
                                   onChange={handleChange}
                                   onBlur={handleBlur}
                                   isValid={touched.classificacaoEtaria && !errors.classificacaoEtaria}
                                   isInvalid={touched.classificacaoEtaria && errors.classificacaoEtaria}
                                />
                                <Form.Control.Feedback type="invalid">{errors.classificacaoEtaria}</Form.Control.Feedback>
                            </Form.Group>
                        </Row>

                        <Form.Group className="text-end">
                            <Button className="me-2" href="/jogos"><FaArrowLeft /> Voltar</Button>
                            <Button type="submit" variant="success"><FaCheck /> Enviar</Button>
                        </Form.Group>
                    </Form>
                )}
            </Formik>
        </Pagina>
    );
}
