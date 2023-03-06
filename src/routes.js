const express = require('express');
const { login } = require('./controllers/login');
const { registeredUser } = require('./controllers/user');
const {
    registerProperty,
    listBuildings,
    listApartments,
    openContract,
    closeContract,
    myListContract,
    requiredContract,
    closeRequirements
} = require('./controllers/crud');
const { filtroAutenticacao } = require('./middleware/autenticacao');

const rotas = express();

rotas.post('/signup', registeredUser);
rotas.post('/signin', login);

rotas.use(filtroAutenticacao)

rotas.post('/close-contract', closeContract)
rotas.get('/list-apartments', listApartments)
rotas.get('/list-buildings', listBuildings);
rotas.post('/register-property', registerProperty);
rotas.post('/open-contract', openContract);
rotas.post('/close-requirement', closeRequirements);
rotas.get('/my-contracts', myListContract)
rotas.get('/requirements', requiredContract)

module.exports = rotas