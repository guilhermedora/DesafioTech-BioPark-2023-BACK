const express = require('express');
const { login } = require('./controladores/login');
const { cadastrarUsuario } = require('./controladores/usuario');
const { listarEdificios, cadastrarPropriedade, listarApartamentos } = require('./controladores/crud');
const { filtroAutenticacao } = require('./intermediarios/autenticacao');

const rotas = express();

rotas.post('/usuario', cadastrarUsuario);
rotas.post('/login', login);

rotas.use(filtroAutenticacao)

rotas.get('/lista-apartamentos', listarApartamentos)
rotas.get('/edificio', listarEdificios);
rotas.post('/propriedade', cadastrarPropriedade);

module.exports = rotas