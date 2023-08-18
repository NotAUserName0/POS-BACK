require('dotenv').config()
const Error = require("../models/error")

async function mostrarErrores(req,res){
    try{
        const documents = await Error.find({})
        res.status(200).json(documents)
    }catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function eliminarErrores(req,res){
    try{
        await Error.deleteMany({}).then(()=>{
            res.status(200).json({message:"exito!"})
        })
    }catch (error) {
        res.status(500).json({ error: error.message });
    }
}

module.exports = {
    mostrarErrores,
    eliminarErrores
}