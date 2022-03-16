const { Pool } = require("pg");

const pool = new Pool({
    user: "postgres",
    host: "localhost",
    database: "banco_solar",
    password: "1234",
    port: "5432",
    max: 12,
    min: 2,
    idleTimeoutMillis: 3000,
    connectTimeoutMillis: 2000,
});

async function add_usuarios(nombre, balance) {
    const client = await pool.connect();

    if (balance == null) {
        console.log("Ingrese datos validos ..!")
        return;
    }
    const { rows } = await client.query({
        text: `insert into usuarios (nombre, balance) values ($1, $2) returning*`,
        values: [nombre, balance],
    });
    //return rows[0];
    client.release();
}

async function get_usuarios() {
    const client = await pool.connect();
    const { rows } = await client.query(`select * from usuarios`);
    client.release();
    return rows;
}

async function update_clientes(id, nombre, balance) {
    const client = await pool.connect();
    const { rows } = await client.query({
        text: `update usuarios set  nombre=$2, balance=$3  where id=$1 returning*`,
        values: [id, nombre, balance],
    });
    return rows[0];
    client.release();
}

async function delete_clientes(id) {
    const client = await pool.connect();
    try {
        await client.query({
            text: `delete from transferencias where emisor=$1 or receptor=$1 returning*`,
            values: [parseInt(id)],
        });
        const { rows } = await client.query({
            text: `delete from usuarios where id=$1 returning*`,
            values: [parseInt(id)],
        });
    } catch (error) {
        console.log(error)
    }
    client.release();
}

async function transferir(nombre_emisor, nombre_receptor, monto) {
    const client = await pool.connect()
    try {
        //emisor
        const { rows } = await client.query({
            text: `select * from usuarios where nombre = $1`,
            values: [nombre_emisor],
        });
        const id_emisor = rows[0].id;
        const menos = rows[0].balance;
        const saldo_emisor = parseInt(menos) - monto;
        //receptor
        const resp = await client.query({
            text: `select * from usuarios where nombre = $1`,
            values: [nombre_receptor],
        });
        const id_receptor = resp.rows[0].id;
        const mas = resp.rows[0].balance;
        const saldo_receptor = parseInt(monto) + parseInt(mas);

        if (monto < menos && id_emisor != id_receptor) {
            await client.query({
                text: `update usuarios set balance=$2  where id=$1 returning*`,
                values: [id_emisor, saldo_emisor],
            });
            await client.query({
                text: `update usuarios set balance=$2  where id=$1 returning*`,
                values: [id_receptor, saldo_receptor],
            });

            await client.query({
                text: `insert into transferencias (emisor, receptor, monto) values ($1, $2, $3)`,
                values: [id_emisor, id_receptor, monto],
            });
        } else {
            console.log("Ingrese datos validos...!");
        }
    } catch (error) {
        console.log(error)
    }
    client.release();
}


async function mostrarTranferir() {
    const client = await pool.connect();
    const { rows } = await client.query({
        text: `select transferencias.id, usuarios.nombre, recep.nombre, transferencias.monto,transferencias.fecha from transferencias join usuarios on transferencias.
        emisor=usuarios.id join usuarios as recep on transferencias.receptor=recep.id`,
        rowMode: "array",
    });
    client.release();
    return rows;
}

module.exports = {
    add_usuarios,
    get_usuarios,
    update_clientes,
    delete_clientes,
    transferir,
    mostrarTranferir,
};