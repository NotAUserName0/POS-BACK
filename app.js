/*
    npm install express multer
    npm install express aws-sdk
*/

const express = require('express');
const app = express()
const cors = require('cors')
const almacenRoutes = require("./routes/almacen")
const connectDB = require('./connections/db');

const http = require('http').createServer(app);
const io = require('./connections/socket')(http);

app.io = io

connectDB().then( //Primero verifico la conexion a la base de datos antes que nada
    () => {

        app.use(cors({
            methods: ['GET', 'POST', 'PUT', 'DELETE'],
            credentials: true
        }))

        app.use("/almacen", almacenRoutes)

        app.get("/", (req, res) => {
            res.json({
                message: "POS API"
            })
        });
        /* INICIA EL SERVIDOR CON HTTP POR EL SOCKET*/
        http.listen(3000, function () {
            console.log("Server On");
        })

    }
).catch((error) => {
    console.error('No database', error)
})