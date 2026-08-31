const express = require('express');
const router = express.Router();
const tutorController = require('../controllers/tutorController');
const { validateTutor } = require('../middleware/validate');

router.get('/', tutorController.getAll);
router.get('/:id', tutorController.getById);
router.post('/', validateTutor, tutorController.create);
router.put('/:id', validateTutor, tutorController.update);
router.delete('/:id', tutorController.remove);

module.exports = router;
