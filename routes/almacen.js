const express = require('express');
const router = express.Router();
const multer = require('multer');
router.use(express.json())
const al = require('../controller/almacenController')

const storage = multer.memoryStorage(); // Almacenar en memoria antes de subir a S3
const upload = multer({ storage: storage });

router.post("/add", upload.single('archivo') ,al.crear);
router.get("/insumos",al.obtener)
router.put("/modificar",upload.single('archivo'),al.modificar);
router.delete("/eliminar/:id",al.eliminar)
router.post("/lista",al.enviarLista)

/* ERROR MANAGEMENT */
router.post("/error",al.guardarErrores)

module.exports = router;