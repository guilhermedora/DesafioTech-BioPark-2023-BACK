const { query } = require('../db/conexao');
const jwt = require('jsonwebtoken');

const filterAuth = async (req, res, next) => {
    const { authorization } = req.headers;
    if (!authorization) {
        return res.status(401).json({
            mensagem: 'Não autorizado'
        });
    }
    try {
        const token = authorization.replace('Bearer ', '').trim();
        const { id } = jwt.verify(token, 'senhaSeguraParaToken');
        const { rowCount, rows } = await query(
            'select * from users where id = $1',
            [id]
        );
        if (rowCount <= 0) {
            return res.status(401).json({ mensagem: 'Não autorizado' });
        }
        const [user] = rows;
        const { senha: _, ...dataUser } = user;
        req.user = dataUser;
        next();
    } catch (error) {
        return res.status(500).json(
            { mensagem: `Erro interno: ${error.message}` }
        );
    }
}

module.exports = {
    filterAuth
}