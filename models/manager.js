const mongoose = require('mongoose')

const managerSchema = new mongoose.Schema({
    nombre:{
        type:String,
        required:true
    },
    user:{
        type: String,
        required : true,
        unique: true,
        validate: {
            validator: async function(value){
                const entry = await this.constructor.findOne({ user: value });
                return !entry;
            },
            message:'Usuario ya existente'
        }
    },
    contacto:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    }
},{
    versionKey: false
})

module.exports = mongoose.model('Manager',managerSchema)