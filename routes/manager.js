const express = require('express');
const router = express.Router();
router.use(express.json())
const man = require("../controller/managerController")

router.post("/add",man.crear)
router.get("/obtener",man.obtener)
router.put("/modificar/:id",man.modificar)
router.delete("/eliminarUno/:id",man.eliminarUno)

module.exports = router;