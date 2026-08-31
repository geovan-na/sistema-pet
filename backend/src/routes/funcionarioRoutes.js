const express = require('express');
const router = express.Router();
const funcionarioController = require('../controllers/funcionarioController');

router.get('/', funcionarioController.getAll);
router.get('/:id', funcionarioController.getById);
router.post('/', funcionarioController.create);
router.put('/:id', funcionarioController.update);
router.delete('/:id', funcionarioController.remove);

module.exports = router;
