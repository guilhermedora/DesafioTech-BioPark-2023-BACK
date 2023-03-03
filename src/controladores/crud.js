const { query } = require("../bancodedados/conexao");

const listarEdificios = async (req, res) => {
    const { usuario } = req;
    try {
        const { rowCount, rows: edificios } = await query('select * from edificios where usuario_id = $1', [usuario.id]);
        if (rowCount <= 0) {
            return res.status(201).json(false);
        }
        return res.status(201).json(edificios)
    } catch (error) {
        return res.status(500).json({ mensagem: `Erro interno: ${error.message}` });
    }
}

const listarApartamentos = async (req, res) => {
    const { usuario } = req;
    try {
        const { rowCount, rows: edificios } = await query('select * from apartamentos where usuarios_id = $1', [usuario.id]);
        if (rowCount <= 0) {
            return res.status(201).json(false);
        }
        return res.status(201).json(edificios)
    } catch (error) {
        return res.status(500).json({ mensagem: `Erro interno: ${error.message}` });
    }
}

const cadastrarPropriedade = async (req, res) => {
    const { usuario } = req;
    const {
        type, name, address,
        description, floor, number,
        building, value, available
    } = req.body;
    if (type !== 'edf' && type !== 'ap') {
        return res.status(400).json({
            mensagen: 'O tipo precisa ser: "edf" para Edificio ou "ap" para Apartamento'
        })
    }
    if (type == "edf") {
        if (!type, !name, !address, !description) {
            return res.status(400).json({ mensagen: 'Todos os campos são obrigatórios' })
        }
        try {
            const edificio = await query('select * from edificios where nome = $1', [name]);

            if (edificio.rowCount) {
                return res.status(404).json({ mensagem: 'O Edificio já existe' });
            }

            const queryCadastro = 'insert into edificios (usuario_id, proprietario, nome, endereco, descricao) values ($1, $2, $3, $4, $5) returning *';
            const paramCadastro = [usuario.id, usuario.nome, name, address, description]
            const { rowCount, rows: edificioCadastrado } = await query(queryCadastro, paramCadastro);

            if (rowCount <= 0) {
                return res.status(500).json({ mensagem: `Erro interno: ${error.message}` });
            }

            return res.status(201).json(edificioCadastrado);
        } catch (error) {
            return res.status(500).json({ mensagem: `Erro interno: ${error.message}` });
        }
    } else {
        try {
            const apartamento = await query('select * from apartamentos where edificio_nome = $1 and numero = $2', [building, number]);

            if (apartamento.rowCount) {
                return res.status(404).json({
                    mensagem: 'O número do apartamento já foi cadastrado para esse prédio.'
                });
            }

            const queryCadastro = 'insert into apartamentos (disponibilidade, edificio_nome, usuarios_id, numero, andar, valor, descricao) values ($1, $2, $3, $4, $5, $6, $7) returning *';
            const paramCadastro = [available, building, usuario.id, number, floor, value, description]
            const { rowCount, rows: apartamentos } = await query(queryCadastro, paramCadastro);

            if (rowCount <= 0) {
                return res.status(500).json({ mensagem: `Erro interno: ${error.message}` });
            }

            return res.status(201).json(apartamentos);
        } catch (error) {
            return res.status(500).json({ mensagem: `Erro interno: ${error.message}` });
        }
    }
}

module.exports = {
    listarApartamentos,
    listarEdificios,
    cadastrarPropriedade,
}