const { query } = require('../bancodedados/conexao')
const bcrypt = require('bcrypt');

const cadastrarUsuario = async (req, res) => {
    const { nome, email, senha, atributo } = req.body;

    if (!nome || !email || !senha || atributo == 'Selecione') {
        return res.status(400).json({ mensagem: 'Todos os campos são obrigatórios' });
    }

    try {
        const usuario = await query('select * from usuarios where email = $1', [email]);

        if (usuario.rowCount > 0) {
            return res.status(400).json({ mensagem: 'O e-mail já existe cadastrado.' });
        }

        const senhaCriptografada = await bcrypt.hash(senha, 10);

        const queryCadastro = 'insert into usuarios (nome, email, senha, atributo) values ($1, $2, $3, $4) returning *';
        const paramCadastro = [nome, email, senhaCriptografada, atributo];
        const usuarioCadastrado = await query(queryCadastro, paramCadastro);

        if (usuarioCadastrado.rowCount <= 0) {
            return res.status(500).json({ mensagem: `Erro interno: ${error.message}` });
        }

        const { senha: _, ...cadastro } = usuarioCadastrado.rows[0]

        return res.status(201).json(cadastro);
    } catch (error) {
        return res.status(500).json({ mensagem: `Erro interno: ${error.message}` });
    }
}

module.exports = {
    cadastrarUsuario
}