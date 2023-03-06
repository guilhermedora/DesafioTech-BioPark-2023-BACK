const { query } = require('../db/conexao')
const bcrypt = require('bcrypt');

const registeredUser = async (req, res) => {
    const { name, email, password, category } = req.body;
    if (
        !name ||
        !email ||
        !password ||
        category == 'Selecione'
    ) {
        return res.status(400).json({
            mensagem: 'Todos os campos são obrigatórios'
        });
    }
    try {
        const user = await query(
            'select * from users where email = $1',
            [email]
        );
        if (user.rowCount > 0) {
            return res.status(400).json({
                mensagem: 'O e-mail já existe cadastrado.'
            });
        }
        const encryptedPass = await bcrypt.hash(password, 10);
        const queryRegistered = `
        insert into users
        (name, email, password, category)
        values 
        ($1, $2, $3, $4)
        returning *`;
        const paramRegistered = [
            name,
            email,
            encryptedPass,
            category
        ];
        const userRegistered = await query(
            queryRegistered,
            paramRegistered
        );

        if (userRegistered.rowCount <= 0) {
            return res.status(500).json({
                mensagem: `Erro interno: ${error.message}`
            });
        }
        const { password: _, ...registered } = userRegistered.rows[0]
        return res.status(201).json(registered);
    } catch (error) {
        return res.status(500).json(
            { mensagem: `Erro interno: ${error.message}` }
        );
    }
}

module.exports = {
    registeredUser
}