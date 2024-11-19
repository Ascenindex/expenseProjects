import express from 'express';
import expenseRouter from './expense.js'; // Certifique-se de que a rota expense.js está correta

const router = express.Router();

// Use o caminho absoluto, ou seja, com uma barra inicial
router.use('/expense', expenseRouter);

// Define a rota para a página inicial (root)
router.get('/', (req, res) => {
  res.send('Hello, this is the home page!');
});

export default router;
