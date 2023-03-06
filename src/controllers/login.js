const { query } = require('../db/conexao')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const login = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json(
            { mensagem: 'Email e senha são obrigatórios' }
        );
    }
    try {
        const { rowCount, rows } = await query(
            'select * from users where email = $1',
            [email]
        );
        if (rowCount <= 0) {
            return res.status(400).json(
                { mensagem: 'Email ou senha estão incorretas' }
            );
        }
        const [user] = rows;
        const encryptedPass = await bcrypt.compare(password, user.password);
        if (!encryptedPass) {
            return res.status(400).json(
                { mensagem: 'Email ou senha estão incorretas' }
            );
        }
        const token = jwt.sign(
            { id: user.id },
            'senhaSeguraParaToken',
            { expiresIn: '8h' }
        );
        const { password: _, ...dataUser } = user;
        return res.status(200).json({
            user: dataUser,
            token
        });
    } catch (error) {
        return res.status(500).json(
            { mensagem: `Erro interno: ${error.message}` }
        );
    }
}

module.exports = {
    login
}