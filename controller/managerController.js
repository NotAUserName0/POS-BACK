require('dotenv').config()
const Manager = require("../models/manager")
const bcrypt = require("bcryptjs")
const {ObjectId} = require('mongodb');

async function crear(req, res) {
    try {
        const newManager = {
            nombre: req.body.nombre,
            user: req.body.user,
            contacto: req.body.contacto,
            password: await bcrypt.hash(req.body.password, 8)
        }

        await Manager.create(newManager).then(() => {
            const io = req.app.io;
            io.sockets.emit('listaManager', () => {
                console.log("reiniciando lista")
            })
            res.status(200).json({message: "created"})
        })
    } catch (error) {
        res.status(500).json({error: error.message});
    }
}

async function obtener(req, res) {
    try {
        await Manager.find({}).then((documents) => {
            res.status(200).send(documents)
        })
    } catch (error) {
        res.status(500).json({error: error.message});
    }
}

async function modificar(req, res) {
    try {
        //revisar que llega
        const id = req.params.id

        if (req.body.nombre) {
            await Manager.updateOne(
                {_id: new ObjectId(id)},
                {$set: {nombre: req.body.nombre}}
            ).then(() => {
                const io = req.app.io;
                io.sockets.emit('listaManager', () => {
                    console.log("reiniciando lista")
                })
            })
        }

        if (req.body.user) {
            await Manager.updateOne(
                {_id: new ObjectId(id)},
                {$set: {user: req.body.user}}
            ).then(() => {
                const io = req.app.io;
                io.sockets.emit('listaManager', () => {
                    console.log("reiniciando lista")
                })
            })
        }

        if (req.body.contacto) {
            await Manager.updateOne(
                {_id: new ObjectId(id)},
                {$set: {contacto: req.body.contacto}}
            ).then(() => {
                const io = req.app.io;
                io.sockets.emit('listaManager', () => {
                    console.log("reiniciando lista")
                })
            })
        }

        if (req.body.password) {
            await Manager.updateOne(
                {_id: new ObjectId(id)},
                {$set: {password: await bcrypt.hash(req.body.password, 8)}}
            ).then(() => {
                const io = req.app.io;
                io.sockets.emit('listaManager', () => {
                    console.log("reiniciando lista")
                })
            })
        }
        res.status(200).json({message: "modificado!"})
    } catch (error) {
        res.status(500).json({error: error.message});
    }
}

async function eliminarUno(req, res) {
    try {
        const id = req.params.id
        await Manager.deleteOne({_id: new ObjectId(id)}).then(() => {
            const io = req.app.io;
            io.sockets.emit('listaManager', () => {
                console.log("reiniciando lista")
            })
        })
        res.status(200).json({message: "eliminado!"})
    } catch (error) {
        res.status(500).json({error: error.message});
    }
}

module.exports = {
    crear,
    obtener,
    modificar,
    eliminarUno
}