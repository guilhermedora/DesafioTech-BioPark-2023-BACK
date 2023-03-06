const { query } = require("../db/conexao");

const registerProperty = async (req, res) => {
    const { id, name } = req.user;
    const {
        type, building_name, address, place_level,
        description, available, apartment_number, value_rent
    } = req.body;

    if (type !== 'edf' && type !== 'ap') {
        return res.status(400).json(
            { mensagen: 'O tipo precisa ser: "edf" para Edificio ou "ap" para Apartamento' }
        )
    }
    if (type == "edf") {
        if (!type, !building_name, !address, !description) {
            return res.status(400).json(
                { mensagen: 'Todos os campos são obrigatórios' }
            )
        }
        try {
            const building = await query('select * from buildings where building_name = $1', [building_name]);
            if (building.rowCount) {
                return res.status(404).json(
                    { mensagem: 'O Edificio já existe' }
                );
            }
            const queryCadaster = `
            insert into buildings 
            (owner_id, owner_name, building_name, address, description)
            values 
            ($1, $2, $3, $4, $5)
            returning *`;
            const paramCadaster = [
                id, name, building_name, address, description
            ]
            const { rowCount, rows: registeredBuilding } = await query(
                queryCadaster, paramCadaster
            );
            if (rowCount <= 0) {
                return res.status(500).json(
                    { mensagem: `Erro interno: ${error.message}` }
                );
            }
            return res.status(201).json(registeredBuilding);
        } catch (error) {
            return res.status(500).json(
                { mensagem: `Erro interno: ${error.message}` }
            );
        }
    } else {
        try {
            const apartament = await query(`
            select * from apartments where building_name = $1 and
             apartment_number = $2`, [building_name, apartment_number]
            );
            if (apartament.rowCount) {
                return res.status(404).json({
                    mensagem: 'O número do apartamento já foi cadastrado para esse prédio.'
                });
            }
            const queryCadaster = `
            insert into apartments 
            (available, building_name, owner_id, apartment_number,
             place_level, value_rent, description) 
            values ($1, $2, $3, $4, $5, $6, $7) 
            returning *`;
            const paramCadaster = [
                available, building_name, id, apartment_number,
                place_level, value_rent, description
            ]
            const { rowCount, rows: apartment } = await query(
                queryCadaster, paramCadaster
            );
            if (rowCount <= 0) {
                return res.status(500).json(
                    { mensagem: `Erro interno: ${error.message}` }
                );
            }
            return res.status(201).json(apartment);
        } catch (error) {
            console.log(error.message);
            return res.status(500).json(
                { mensagem: `Erro interno: ${error.message}` }
            );
        }
    }
}

const listBuildings = async (req, res) => {
    const { category, id } = req.user;
    try {
        if (category === 'Locatário') {
            var { rowCount, rows: buildings } = await query(
                `select * from buildings`
            );
        } else {
            var { rowCount, rows: buildings } = await query(
                `select * from buildings where owner_id = $1`, [id]
            );
        }

        if (rowCount <= 0) {
            return res.status(201).json(false);
        }
        return res.status(201).json(buildings)
    } catch (error) {
        return res.status(500).json({ mensagem: `Erro interno: ${error.message}` });
    }
}

const listApartments = async (req, res) => {
    const { category, id } = req.user;
    try {
        if (category === 'Locatário') {
            var { rowCount, rows: buildings } = await query(`
            select * from apartments where available = $1`, [true]);
        } else {
            var { rowCount, rows: buildings } = await query(`
        select * from apartments where owner_id = $1`, [id]);
        }
        if (rowCount <= 0) {
            return res.status(201).json(false);
        }
        return res.status(201).json(buildings)
    } catch (error) {
        return res.status(500).json(
            { mensagem: `Erro interno: ${error.message}` }
        );
    }
}


const openContract = async (req, res) => {
    const { category, id } = req.user;
    const { name: renter_name, email: renter_email, renter_phone,
        building_name, apartment_number, value_rent,
        date_start, month_number, owner_id } = req.body;
    console.log(req.body, 'casa');
    if (!renter_name, !renter_email, !renter_phone,
        !date_start, !month_number) {
        return res.status(400).json(
            { mensagen: 'Todos os campos são obrigatórios' }
        )
    }
    try {
        const { rows: renter_id, rowCount } = await query(
            'select id from users where email = $1',
            [renter_email]
        );

        if (rowCount <= 0) {
            return res.status(404).json(
                { mensagem: 'O Locador não existe na base' }
            );
        }
        const queryCadastro = `
        insert into contracts 
        (renter_id, renter_name, renter_email, renter_phone, owner_id,
        building_name, apartment_number, value_rent, date_start,
        month_number, status, required) 
        values 
        ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) 
        returning *`;
        if (category === 'Locador') {
            var paramCadastro = [
                renter_id[0].id, renter_name, renter_email,
                renter_phone, id, building_name, apartment_number,
                value_rent, date_start, month_number,
                true, false]
        } else {
            var paramCadastro = [
                id, renter_name, renter_email, renter_phone,
                owner_id, building_name, apartment_number, value_rent,
                date_start, month_number,
                false, true]
        }
        const { rowCount: search, rows: done } = await query(
            queryCadastro, paramCadastro
        );
        if (search <= 0) {
            return res.status(500).json(
                { mensagem: `Erro interno: ${error.message}` }
            );
        }
        if (category === 'Locador') {
            await query(`update apartments 
            set available = $1, renter_id = $2, renter_name = $3, renter_email = $4
            where building_name = $5 and apartment_number = $6`,
                [false, renter_id[0].id, renter_name,
                    renter_email, building_name, apartment_number])
        }
        return res.status(201).json(done);
    } catch (error) {
        console.log(error.message);
        return res.status(500).json(
            { mensagem: `Erro interno: ${error.message}` }
        );
    }
}

const fecharContrato = async (req, res) => {
    const { orderFrom, building_name,
        apartment_number, renter_email } = req.body
    console.log(req.body);
    try {
        if (!orderFrom) {
            return res.status(400).json({ mensagem: 'Email é obrigatório' });
        }
        const { rowCount } = await query(
            `select * from contracts where renter_email = $1 and
             apartment_number = $2 and building_name = $3`,
            [orderFrom, apartment_number, building_name]);
        if (rowCount <= 0) {
            return res.status(400).json(
                { mensagem: 'Não existe contrato para este locador.' }
            );
        }
        const { rowCount: cancelAp } = await query(`
        update apartments 
        set available = $1, renter_id = $2 
        where building_name = $3 and apartment_number = $4 returning *`,
            [
                true,
                null,
                building_name,
                apartment_number
            ])
        if (cancelAp <= 0) {
            return res.status(500).json({ mensagem: 'Falha no servidor.' });
        }
        const { rowCount: contractCancel } = await query(`
        update contracts set status = $1 and set required = $2
        where building_name = $3 and apartment_number = $4
        and renter_email = $5 returning *`,
            [
                false,
                false,
                building_name,
                apartment_number,
                orderFrom
            ])
        if (contractCancel <= 0) {
            return res.status(500)
        } else {
            return res.status(201).json('OK');
        }
    } catch (error) {
        console.log(error.message);
        return res.status(500);
    }
}

const listarMeusContratos = async (req, res) => {
    const { id, category } = req.user;
    const status = true
    try {
        if (category === 'Locador') {
            console.log('loc');
            var { rowCount, rows: contratos } = await query(
                `select * from contracts where status=$1 and owner_id=$2`, [status, id]
            );
            console.log(rowCount, '`222');
        } else {
            var { rowCount, rows: contratos } = await query(
                `select * from contracts where status=$1 and renter_id= $2`, [status, id]
            );
        }
        console.log('2', rowCount);
        if (rowCount <= 0) {
            return res.status(201).json(false);
        }
        return res.status(201).json(contratos)
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ mensagem: `Erro interno: ${error.message}` });
    }
}

const contratosRequisitados = async (req, res) => {
    const { id } = req.user;
    const algo = req.body
    console.log(req.user, algo, '@@@');
    try {
        const { rowCount, rows: required } = await query(
            `select * from contracts where required = true and owner_id = $1`,
            [id]
        );
        console.log(rowCount);
        if (rowCount <= 0) {
            return res.status(201).json(false);
        }
        return res.status(201).json(required)
    } catch (error) {
        return res.status(500).json({ mensagem: `Erro interno: ${error.message}` });
    }
}

const closeRequirements = async (req, res) => {
    const { building_name, apartment_number, renter_email } = req.body
    try {
        const { rowCount: contractCancel } = await query(`
        update contracts set required = $1
        where building_name = $2 and apartment_number = $3
        and renter_email = $4 returning *`,
            [
                false,
                building_name,
                apartment_number,
                renter_email
            ])
        console.log(contractCancel, '@@@');
        if (contractCancel <= 0) {
            return res.status(500);
        }
        return res.status(201)
    } catch (error) {
        return res.status(500).json({ mensagem: `Erro interno: ${error.message}` });
    }
}
module.exports = {
    registerProperty,
    listBuildings,
    listApartments,
    openContract,
    fecharContrato,
    listarMeusContratos,
    contratosRequisitados,
    closeRequirements
}