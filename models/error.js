const mongoose = require('mongoose')

const errorSchema = new mongoose.Schema({
    ubicacion:{
        type:String
    },
    descripcion:{
        type:String
    },
    contenido:{
        type:String
    }
},{
    versionKey: false
})

module.exports = mongoose.model('Error',errorSchema)