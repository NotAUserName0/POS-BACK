require('dotenv').config()
const { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner")
const { ObjectId } = require('mongodb');
const uuid = require('uuid');
const Insumo = require("../models/insumo")

const client = new S3Client({
    region: process.env.REGION, // Por ejemplo, 'us-east-1'
    credentials: {
        accessKeyId: process.env.ACCESS_KEY_ID,
        secretAccessKey: process.env.SECRET_ACCESS_KEY,
    }
});

async function crear(req, res) {
    try {
        const archivo = req.file;
        req.file.originalname = uuid.v4()

        const newInsumo = {
            nombre: req.body.nombre,
            tipo: req.body.tipo,
            foto: req.file.originalname
        }

        uploadToAWS(archivo).then(()=>{
            Insumo.create(newInsumo).then(()=>{
                const io = req.app.io;
                io.sockets.emit('recargar',()=>{
                    console.log("reiniciando lista")
                })
                res.status(200).json({ message: "Exito" })
            })
        })

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function obtener(req, res) {
    try {
        const documents = await Insumo.find({})
        const modifiedArray = await Promise.all(documents.map(async element => {
            const params = {
                Bucket: process.env.BUCKET,
                Key: element.foto
            };
            const command = new GetObjectCommand(params);
            const res = await getSignedUrl(client, command, { expiresIn: 3600 });
            element.foto = res;
            return element; // Es importante retornar el elemento modificado
        }));
        

        res.status(200).json(modifiedArray)


    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function modificar(req,res){
    try{
        //recibo
        const json = JSON.parse(req.body.form)

        let insumoModificado = {
            nombre: json.nombre,
            tipo:json.tipo,
        }

        changeInAWS(json.id,req.file).then(()=>{
             Insumo.updateOne(
                {_id:new ObjectId(json.id)},
                {$set:insumoModificado}
            ).then(()=>{
                const io = req.app.io;
                io.sockets.emit('recargar',()=>{
                    console.log("reiniciando lista")
                })
                res.status(200).json({message:"modificado!"})
            })
        })

    }catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function eliminar(req,res){
    try{
        const id = req.params.id

        deleteInAWS(id).then(()=>{
            Insumo.deleteOne({_id:new ObjectId(id)}).then(()=>{
                const io = req.app.io;
                io.sockets.emit('recargar',()=>{
                    console.log("reiniciando lista")
                })
                res.status(200).json({message:"eliminado!"})
            })
        })

    }catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function enviarLista(req,res){
    try{
        const data = req.body
        console.log(data)

        /* IMPLEMENTACION DE SMTP PROTOCOL */

        res.status(200).json({msg:"llego!"})

    }catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function uploadToAWS(archivo) {

    const params = {
        Bucket: process.env.BUCKET,
        Key: archivo.originalname,
        Body: archivo.buffer
    };

    let dataExist = false

    const command = new PutObjectCommand(params);
    const data = await client.send(command);
    console.log('Archivo subido exitosamente');

    if (data.ETag) {
        dataExist = true;
    }

    return dataExist
}

async function changeInAWS(id, archivo){

    try{
        if(archivo == undefined){
            return false
        }

        const InsumoAnt = await Insumo.findOne(
            {_id: new ObjectId(id)},
            {_id:0,nombre:0,tipo:0}
        )

        const params = {
            Bucket: process.env.BUCKET,
            Key: InsumoAnt.foto,
            Body: archivo.buffer
        };

        const command = new PutObjectCommand(params);
        const data = await client.send(command);

        return true
    }catch (error) {
        console.log(error)
    }
}

async function deleteInAWS(id){
    try{
        const insumo = await Insumo.findOne(
            {_id: new ObjectId(id)},
            {_id:0,nombre:0,tipo:0}
        ) //obtiene el id que esta en S3

        const params = {
            Bucket: process.env.BUCKET,
            Key: insumo.foto,
        };

        const command = new DeleteObjectCommand(params)
        const data = await client.send(command)

        return true
    }catch (error) {
        console.log(error)
    }
}

module.exports = {
    crear,
    obtener,
    modificar,
    eliminar,
    enviarLista
}


