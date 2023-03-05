const { query } = require("../bancodedados/conexao");

const listarEdificios = async (req, res) => {
    const { usuario } = req;
    try {
        const { rowCount, rows: edificios } = await query('select * from edificios where proprietario_id = $1', [usuario.id]);
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
        const { rowCount, rows: edificios } = await query(`
        select * from apartamentos where locatario_id = $1`, [usuario.id]);
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
            const edificio = await query('select * from edificios where edificio_nome = $1', [name]);

            if (edificio.rowCount) {
                return res.status(404).json({ mensagem: 'O Edificio já existe' });
            }

            const queryCadastro = `
            insert into edificios 
            (proprietario_id, proprietario_nome, edificio_nome, endereco, descricao)
            values 
            ($1, $2, $3, $4, $5)
            returning *`;
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
            const apartamento = await query(`
            select * from apartamentos where edificio_nome = $1 and numero = $2`, [building, number]
            );

            if (apartamento.rowCount) {
                return res.status(404).json({
                    mensagem: 'O número do apartamento já foi cadastrado para esse prédio.'
                });
            }

            const queryCadastro = `
            insert into apartamentos 
            (disponibilidade, edificio_nome, locatario_id, numero, andar, valor, descricao) 
            values ($1, $2, $3, $4, $5, $6, $7) 
            returning *`;
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

const contractOpen = async (req, res) => {
    const { usuario } = req;
    const {
        name, email, phone,
        date, vigencia, edificio_nome,
        locatario_id, numero, valor
    } = req.body;
    if (
        !email, !phone, !locatario_id, !edificio_nome,
        !numero, !valor, !date, !vigencia) {
        return res.status(400).json({ mensagen: 'Todos os campos são obrigatórios' })
    }
    try {
        const { rows: locador, rowCount } = await query('select id from usuarios where email = $1', [email]);

        if (rowCount <= 0) {
            return res.status(404).json({ mensagem: 'O Locador não existe na base' });
        }
        const queryCadastro = `
        insert into contratosfindados 
        (locador_id, locador_nome, locador_email, locador_telefone, locatario_id, edificio_nome,
        apartamento_numero, valor_aluguel, data_inicio, vigencia, status) 
        values 
        ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) 
        returning *`;
        const paramCadastro = [
            locador[0].id, name, email, phone, usuario.id,
            edificio_nome, numero, valor, date, vigencia, true
        ]
        const { rowCount: search, rows: tratofeito } = await query(queryCadastro, paramCadastro);

        if (search <= 0) {
            return res.status(500).json({ mensagem: `Erro interno: ${error.message}` });
        } else {
            await query(`update apartamentos 
            set disponibilidade = $1, locador_id = $2 
            where edificio_nome = $3 and numero = $4`,
                [false, locador[0].id, edificio_nome, numero])
        }

        return res.status(201).json(tratofeito);
    } catch (error) {
        return res.status(500).json({ mensagem: `Erro interno: ${error.message}` });
    }
}

const contractClose = async (req, res) => {
    const info = req.body

    try {
        if (!info.orderFrom) {
            return res.status(400).json({ mensagem: 'Email é obrigatório' });
        }
        const { rowCount } = await query(
            `select * from contratosfindados where locador_email = $1 and
             apartamento_numero = $2 and edificio_nome = $3`,
            [info.orderFrom, info.numero, info.edificio_nome]);

        if (rowCount <= 0) {
            return res.status(400).json({ mensagem: 'Não existe contrato para este locador.' });
        }

        const { rowCount: cancelAp } = await query(`
        update apartamentos 
    set disponibilidade = $1, locador_id = $2 
    where edificio_nome = $3 and numero = $4 returning *`,
            [
                true,
                null,
                info.edificio_nome,
                info.numero
            ])

        if (cancelAp <= 0) {
            return res.status(500).json({ mensagem: 'Falha no servidor.' });
        }

        await query(`
        update contratosfindados set status = $1 
        where edificio_nome = $2 and apartamento_numero = $3 and locador_email = $4`,
            [
                false,
                info.edificio_nome,
                info.numero,
                info.orderFrom
            ])

        return res.status(201).json('OK');
    } catch (error) {
        return res.status(500);
    }
}

module.exports = {
    listarApartamentos,
    listarEdificios,
    cadastrarPropriedade,
    contractOpen,
    contractClose
}