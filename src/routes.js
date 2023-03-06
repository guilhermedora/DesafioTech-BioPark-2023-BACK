const express = require('express');
const { login } = require('./controllers/login');
const { registeredUser } = require('./controllers/user');
const {
    registerProperty,
    listBuildings,
    listApartments,
    openContract,
    fecharContrato,
    listarMeusContratos,
    contratosRequisitados,
    closeRequirements
} = require('./controllers/crud');
const { filtroAutenticacao } = require('./middleware/autenticacao');

const rotas = express();

rotas.post('/signup', registeredUser);
rotas.post('/signin', login);

rotas.use(filtroAutenticacao)

rotas.post('/fechar-contrato', fecharContrato)
rotas.get('/list-apartments', listApartments)
rotas.get('/list-buildings', listBuildings);
rotas.post('/register-property', registerProperty);
rotas.post('/open-contract', openContract);
rotas.post('/close-requirement', closeRequirements);
rotas.get('/meus-contratos', listarMeusContratos)
rotas.get('/requerimentos', contratosRequisitados)

module.exports = rotas