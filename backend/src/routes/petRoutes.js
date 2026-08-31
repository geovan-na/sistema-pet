const express = require('express');
const router = express.Router();
const petController = require('../controllers/petController');
const { validatePet } = require('../middleware/validate');

router.get('/', petController.getAll);
router.get('/:id', petController.getById);
router.post('/', validatePet, petController.create);
router.put('/:id', validatePet, petController.update);
router.delete('/:id', petController.remove);

module.exports = router;
