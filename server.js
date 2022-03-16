const express = require("express");
const app = express();
const {
    add_usuarios,
    get_usuarios,
    update_clientes,
    delete_clientes,
    transferir,
    mostrarTranferir,
} = require("./db.js");

// para servir archivos estáticos
app.use(express.static("public"));

// acá definimos nuestras rutas
app.get("/", (req, res) => {
    res.json({ todo: "ok" });
});

app.post("/usuario", async(req, res) => {
    let body = "";
    req.on("data", (data) => (body += data));
    req.on("end", async() => {
        body = JSON.parse(body);
        try {
            await add_usuarios(body.nombre, body.balance);
        } catch (error) {
            if (error.code == '23505') {
                console.log(error);
                return res.status(400).send({ mensaje: "este nombre de usuario ya existe" });
            }
        }
        res.json({ todo: 'ok' })
    });
});

app.get("/usuarios", async(req, res) => {
    const user = await get_usuarios();
    res.json(user);
});

app.put("/usuario", async(req, res) => {
    let body = "";
    req.on("data", (data) => (body += data));

    req.on("end", async() => {
        console.log(body);
        body = JSON.parse(body);
        try {
            await update_clientes(query.body.id, body.name, body.balance);
        } catch (error) {
            if (error.code == "22P02") {
                console.log(error);
                return res.status(400).send({ mensaje: "No puede existir campos vacios" });
            }
        }
        res.json({ todo: 'ok' })
    });
});

app.delete("/usuario", async(req, res) => {
    const id = req.query.id;
    await delete_clientes(id);
    res.send({ todo: "ok" });
});

// ****************************************************************
app.post("/transferencia", async(req, res) => {
    let body = "";
    req.on("data", (data) => (body += data));
    req.on("end", async() => {
        body = JSON.parse(body);
        await transferir(body.emisor, body.receptor, body.monto);
        res.status(201).json({ todo: "ok" });
    });
});

app.get("/transferencias", async(req, res) => {
    const user = await mostrarTranferir();
    res.json(user);
});

app.listen(3000, () => console.log("Servidor ejecutando en puerto 3000"));