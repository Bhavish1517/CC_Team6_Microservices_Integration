const express = require('express');
const Tutorial = require('../models/tutorial.cjs')
const router = express.Router();

// GET route to fetch all tutorials
router.get('/', async (req, res) => {
  try {
    const tutorials = await Tutorial.findAll();
    res.json(tutorials);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error fetching tutorials');
  }
});

// GET route to fetch a single tutorial by ID
router.get('/:id', async (req, res) => {
  try {
    const tutorial = await Tutorial.findByPk(req.params.id);
    if (!tutorial) {
      return res.status(404).json({ message: 'Tutorial not found' });
    }
    res.json(tutorial);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error fetching tutorial');
  }
});

// POST route to create a new tutorial
router.post('/', async (req, res) => {
  const { title, description, videoUrl, modules, question, options, correctAnswer } = req.body;

  // Log received request body
  console.log('Received data:', req.body);

  try {
    const newTutorial = await Tutorial.create({
      title,
      description,
      videoUrl,
      modules,
      question,
      options,
      correctAnswer
    });
    res.status(201).json(newTutorial);
  } catch (error) {
    console.error('Error adding tutorial:', error);
    res.status(500).send('Error adding tutorial');
  }
});

// PUT route to update a tutorial by ID
router.put('/:id', async (req, res) => {
  const { title, description, videoUrl, modules, question, options, correctAnswer } = req.body;

  try {
    const tutorial = await Tutorial.findByPk(req.params.id);
    if (!tutorial) {
      return res.status(404).json({ message: 'Tutorial not found' });
    }

    await tutorial.update({
      title,
      description,
      videoUrl,
      modules,
      question,
      options,
      correctAnswer
    });

    res.json(tutorial);
  } catch (error) {
    console.error('Error updating tutorial:', error);
    res.status(500).send('Error updating tutorial');
  }
});

// DELETE route to remove a tutorial by ID
router.delete('/:id', async (req, res) => {
  try {
    const tutorial = await Tutorial.findByPk(req.params.id);
    if (!tutorial) {
      return res.status(404).json({ message: 'Tutorial not found' });
    }
    await tutorial.destroy();
    res.status(200).json({ message: 'Tutorial deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error deleting tutorial');
  }
});

module.exports = router;
