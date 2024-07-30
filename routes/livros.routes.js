const express = require('express');
const router = express.Router();
const LivroController = require('../controllers/LivroController');

// Rota para cadastrar um novo livro
router.post('/livros', LivroController.create);

// Rota para listar todos os livros
router.get('/livros', LivroController.findAll);

// Rota para listar um livro específico
router.get('/livros/:id', LivroController.findOne);

// Rota para atualizar um livro específico
router.put('/livros/:id', LivroController.update);

// Rota para deletar um livro específico
router.delete('/livros/:id', LivroController.delete);

module.exports = router;

