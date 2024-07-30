const { Livro } = require('../models');

module.exports = {
  // Criar um novo livro
  create: async (req, res) => {
    try {
      const livro = await Livro.create(req.body);
      res.status(201).json(livro);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  // Listar todos os livros
  findAll: async (req, res) => {
    try {
      const livros = await Livro.findAll();
      res.status(200).json(livros);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  // Listar um livro específico
  findOne: async (req, res) => {
    try {
      const livro = await Livro.findByPk(req.params.id);
      if (!livro) {
        return res.status(404).json({ error: 'Livro não encontrado' });
      }
      res.status(200).json(livro);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  // Atualizar um livro específico
  update: async (req, res) => {
    try {
      const livro = await Livro.findByPk(req.params.id);
      if (!livro) {
        return res.status(404).json({ error: 'Livro não encontrado' });
      }
      await livro.update(req.body);
      res.status(200).json(livro);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  // Deletar um livro específico
  delete: async (req, res) => {
    try {
      const livro = await Livro.findByPk(req.params.id);
      if (!livro) {
        return res.status(404).json({ error: 'Livro não encontrado' });
      }
      await livro.destroy();
      res.status(200).json({ message: 'Livro deletado com sucesso' });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },
};




