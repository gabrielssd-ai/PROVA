'use client';

import Pagina from '@/components/Pagina';
import { Formik } from 'formik';
import { useRouter } from 'next/navigation';
import React from 'react';
import { Button, Col, Form, Row } from 'react-bootstrap';
import { FaArrowLeft, FaCheck } from 'react-icons/fa';
import { v4 } from 'uuid';
import * as Yup from 'yup';
import ReactInputMask from 'react-input-mask';

export default function page(props) {
    const router = useRouter();
    const desenvolvedores = JSON.parse(localStorage.getItem('desenvolvedor')) || [];

    const id = props.searchParams.id;
    const desenvolvedorEditado = desenvolvedores.find(item => item.id == id);

    function salvar(dados) {
        if (desenvolvedorEditado) {
            Object.assign(desenvolvedorEditado, dados);
            localStorage.setItem('desenvolvedor', JSON.stringify(desenvolvedores));
        } else {
            dados.id = v4();
            desenvolvedores.push(dados);
            localStorage.setItem('desenvolvedor', JSON.stringify(desenvolvedores));
        }

        alert("Desenvolvedor cadastrado com sucesso!");
        router.push("/desenvolvedor");
    }

    const initialValues = {
        nome: '',
        fundacao: '',
        paisOrigem: '',
        descricao: '',
        fundadores: '',
        areasEspecializacao: '',
        premiosRecebidos: '',
        numeroFuncionarios: ''
    };

    const validationSchema = Yup.object().shape({
        nome: Yup.string().required("Campo Obrigatório"),
        fundacao: Yup.date().required("Campo Obrigatório"),
        paisOrigem: Yup.string().required("Campo Obrigatório"),
        descricao: Yup.string().required("Campo Obrigatório"),
        fundadores: Yup.string().required("Campo Obrigatório"),
        areasEspecializacao: Yup.string().required("Campo Obrigatório"),
        premiosRecebidos: Yup.string().required("Campo Obrigatório"),
        numeroFuncionarios: Yup.number().positive("Deve ser um número positivo").required("Campo Obrigatório")
    });

    return (
        <Pagina titulo={"Cadastro de Desenvolvedor"} >
            <Formik
                initialValues={desenvolvedorEditado || initialValues}
                validationSchema={validationSchema}
                onSubmit={salvar}
            >
                {({ values, errors, touched, handleBlur, handleChange, handleSubmit }) => (
                    <Form onSubmit={handleSubmit}>
                        <Row>
                            <Form.Group as={Col}>
                                <Form.Label>Nome da Empresa:</Form.Label>
                                <Form.Control 
                                    name='nome'
                                    type='text'
                                    value={values.nome}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    isValid={touched.nome && !errors.nome}
                                    isInvalid={touched.nome && errors.nome}
                                />
                                <Form.Control.Feedback type='invalid'>{errors.nome}</Form.Control.Feedback>
                            </Form.Group>

                            <Form.Group as={Col}>
                                <Form.Label>Fundação:</Form.Label>
                                <Form.Control as={ReactInputMask}
                                   mask="9999/99/99"
                                   name="fundacao"
                                   value={values.fundacao}
                                   onChange={handleChange}
                                   onBlur={handleBlur}
                                   isValid={touched.fundacao && !errors.fundacao}
                                   isInvalid={touched.fundacao && errors.fundacao}
                                />
                                <Form.Control.Feedback type='invalid'>{errors.fundacao}</Form.Control.Feedback>
                            </Form.Group>
                        </Row>

                        <Row>
                            <Form.Group as={Col}>
                                <Form.Label>País de Origem:</Form.Label>
                                <Form.Control 
                                    name='paisOrigem'
                                    type='text'
                                    value={values.paisOrigem}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    isValid={touched.paisOrigem && !errors.paisOrigem}
                                    isInvalid={touched.paisOrigem && errors.paisOrigem}
                                />
                                <Form.Control.Feedback type='invalid'>{errors.paisOrigem}</Form.Control.Feedback>
                            </Form.Group>

                            <Form.Group as={Col}>
                                <Form.Label>Descrição:</Form.Label>
                                <Form.Control 
                                    name='descricao'
                                    as='textarea'
                                    rows={3}
                                    value={values.descricao}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    isValid={touched.descricao && !errors.descricao}
                                    isInvalid={touched.descricao && errors.descricao}
                                />
                                <Form.Control.Feedback type='invalid'>{errors.descricao}</Form.Control.Feedback>
                            </Form.Group>
                        </Row>

                        <Row>
                            <Form.Group as={Col}>
                                <Form.Label>Nome dos Fundadores:</Form.Label>
                                <Form.Control 
                                    name='fundadores'
                                    type='text'
                                    value={values.fundadores}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    isValid={touched.fundadores && !errors.fundadores}
                                    isInvalid={touched.fundadores && errors.fundadores}
                                />
                                <Form.Control.Feedback type='invalid'>{errors.fundadores}</Form.Control.Feedback>
                            </Form.Group>

                            <Form.Group as={Col}>
                                <Form.Label>Áreas de Especialização:</Form.Label>
                                <Form.Control 
                                    name='areasEspecializacao'
                                    type='text'
                                    value={values.areasEspecializacao}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    isValid={touched.areasEspecializacao && !errors.areasEspecializacao}
                                    isInvalid={touched.areasEspecializacao && errors.areasEspecializacao}
                                />
                                <Form.Control.Feedback type='invalid'>{errors.areasEspecializacao}</Form.Control.Feedback>
                            </Form.Group>
                        </Row>

                        <Row>
                            <Form.Group as={Col}>
                                <Form.Label>Prêmios Recebidos:</Form.Label>
                                <Form.Control 
                                    name='premiosRecebidos'
                                    type='text'
                                    as='textarea'
                                    rows={3}
                                    value={values.premiosRecebidos}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    isValid={touched.premiosRecebidos && !errors.premiosRecebidos}
                                    isInvalid={touched.premiosRecebidos && errors.premiosRecebidos}
                                />
                                <Form.Control.Feedback type='invalid'>{errors.premiosRecebidos}</Form.Control.Feedback>
                            </Form.Group>

                            <Form.Group as={Col}>
                                <Form.Label>Número de Funcionários:</Form.Label>
                                <Form.Control as={ReactInputMask}
                                   mask="9999"
                                   name="numeroFuncionarios"
                                   value={values.numeroFuncionarios}
                                   onChange={handleChange}
                                   onBlur={handleBlur}
                                   isValid={touched.numeroFuncionarios && !errors.numeroFuncionarios}
                                   isInvalid={touched.numeroFuncionarios && errors.numeroFuncionarios}
                                />
                                <Form.Control.Feedback type='invalid'>{errors.numeroFuncionarios}</Form.Control.Feedback>
                            </Form.Group>
                        </Row>

                        <Form.Group className='text-end'>
                            <Button className='me-2' href='/desenvolvedor'><FaArrowLeft /> Voltar</Button>
                            <Button type='submit' variant='success'><FaCheck /> Enviar</Button>
                        </Form.Group>
                    </Form>
                )}
            </Formik>
        </Pagina>
    );
}
