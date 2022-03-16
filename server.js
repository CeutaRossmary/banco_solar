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
        await add_usuarios(body.nombre, body.balance);
        res.status(201).json({ todo: "ok" });
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

        await update_clientes(query.body.id, body.name, body.balance);
        res.status(201).json({ todo: "ok" });
        console.log("base de datos actualizada  ", body);
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

app.listen(3000, () => console.log("Sservidor ejecutando en puerto 3000"));