const mongoose = require('mongoose')

const insumoSchema = new mongoose.Schema({
    nombre:{
        type:String,
        required:true
    },
    tipo:{
        type:String
    },
    foto:{
        type:String,
        required:true
    },
},{
    versionKey: false
})

module.exports = mongoose.model('Almacen',insumoSchema)