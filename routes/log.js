const express = require('express');
const router = express.Router();
const log = require('../controller/logController')
router.use(express.json())

router.get("/errors",log.mostrarErrores)
router.delete("/delErrors",log.eliminarErrores)

module.exports = router;