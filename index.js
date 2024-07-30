require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const { sequelize } = require('./models');
const app = express();
const port = 3000;
const livrosRouter = require('./routes/livros.routes');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(livrosRouter);

app.listen(port, async () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
  try {
    await sequelize.authenticate();
    console.log('Conectado ao banco de dados!');
  } catch (error) {
    console.error('Não foi possível conectar ao banco de dados:', error);
  }
});

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Livro } = require('./models');
const auth = require('./middleware/auth');
const { Op } = require('sequelize');

const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'Livraria API',
      version: '1.0.0',
    },
    servers: [
      {
        url: 'http://localhost:3000',
      },
    ],
  },
  apis: ['./index.js'],
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Rotas
/**
 * @swagger
 * /livro:
 *   post:
 *     summary: Cria um novo livro
 *     tags: [Livros]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *               qtd_paginas:
 *                 type: integer
 *               categoria:
 *                 type: string
 *               autor:
 *                 type: string
 *     responses:
 *       201:
 *         description: Livro criado com sucesso!
 *       400:
 *         description: Erro na criação do livro.
 */
app.post('/livro', async (req, res) => {
  const { nome, qtd_paginas, categoria, autor } = req.body;

  try {
    const livro = await Livro.create({ nome, qtd_paginas, categoria, autor });
    res.status(201).send(livro);
  } catch (error) {
    console.error('Erro ao criar livro:', error);
    res.status(500).send({ error: 'Erro ao criar livro.' });
  }
});

/**
 * @swagger
 * /livro:
 *   get:
 *     summary: Lista todos os livros
 *     tags: [Livros]
 *     responses:
 *       200:
 *         description: Lista de livros
 *       400:
 *         description: Erro na listagem dos livros
 */
app.get('/livro', async (req, res) => {
  try {
    const livros = await Livro.findAll();
    res.send(livros);
  } catch (error) {
    console.error('Erro ao listar livros:', error);
    res.status(500).send({ error: 'Erro ao listar livros.' });
  }
});

/**
 * @swagger
 * /livro/{id}:
 *   get:
 *     summary: Obtém detalhes de um livro específico
 *     tags: [Livros]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Detalhes do livro
 *       404:
 *         description: Livro não encontrado
 */
app.get('/livro/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const livro = await Livro.findOne({ where: { id } });
    if (!livro) {
      return res.status(404).send({ error: 'Livro não encontrado.' });
    }

    res.send(livro);
  } catch (error) {
    console.error('Erro ao obter detalhes do livro:', error);
    res.status(500).send({ error: 'Erro ao obter detalhes do livro.' });
  }
});

/**
 * @swagger
 * /livro/{id}:
 *   put:
 *     summary: Atualiza informações de um livro específico
 *     tags: [Livros]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *               qtd_paginas:
 *                 type: integer
 *               categoria:
 *                 type: string
 *               autor:
 *                 type: string
 *     responses:
 *       200:
 *         description: Livro atualizado com sucesso!
 *       404:
 *         description: Livro não encontrado.
 */
app.put('/livro/:id', async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  try {
    const livro = await Livro.findOne({ where: { id } });
    if (!livro) {
      return res.status(404).send({ error: 'Livro não encontrado.' });
    }

    Object.keys(updates).forEach(update => livro[update] = updates[update]);
    await livro.save();

    res.send(livro);
  } catch (error) {
    console.error('Erro ao atualizar livro:', error);
    res.status(500).send({ error: 'Erro ao atualizar livro.' });
  }
});

/**
 * @swagger
 * /livro/{id}:
 *   delete:
 *     summary: Deleta um livro específico
 *     tags: [Livros]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Livro deletado com sucesso!
 *       404:
 *         description: Livro não encontrado.
 */
app.delete('/livro/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const livro = await Livro.findOne({ where: { id } });
    if (!livro) {
      return res.status(404).send({ error: 'Livro não encontrado.' });
    }

    await livro.destroy();
    res.send({ message: 'Livro deletado com sucesso.' });
  } catch (error) {
    console.error('Erro ao deletar livro:', error);
    res.status(500).send({ error: 'Erro ao deletar livro.' });
  }
});


