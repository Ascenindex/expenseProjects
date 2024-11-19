import express from 'express';
import fs from 'fs';

const router = express.Router();

/*
  uma rota CRUD para despesas ela vai criar,ler,deletar e atualizar
  as despesas vao ter ID, nome, descrição preço e data
  tera um JSON que tera as info em memoria das despesas
  O JSON é salvo em um arquivo 'expenses.json'
  Para simular um banco de dados, eu vou usar um JSON.stringify()
  para converter o objeto para uma string e salvar esse string no arquivo
  e fs.readFileSync() para ler esse arquivo e converter de volta para um objeto
  Ao fazer essa leitura, eu vou usar JSON.parse() para converter a string de volta para um objeto
  a ideia 'original' é somar as despesas que estara em uma função
*/

let originalExpenses = [];

try {
  const data = fs.readFileSync('expenses.json');
  originalExpenses = JSON.parse(data);
} catch (error) {
  console.error('Error reading expenses.json:', error);
}

router.get('/', (req, res) => {
  res.json(originalExpenses);
});

router.post('/', (req, res) => {
  const expense = {
    id: originalExpenses.length + 1,
    name: req.body.name,
    description: req.body.description,
    price: parseFloat(req.body.price),
    date: new Date(),
  };

  originalExpenses.push(expense);

  fs.writeFileSync('expenses.json', JSON.stringify(originalExpenses));
  res.json(expense);
  // Atualiza o total com as despesas novamente
  updateTotal();
  console.table(expense);
});

router.put('/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = originalExpenses.findIndex((expense) => expense.id === id);
  if (index === -1) {
    return res.status(404).json({ message: 'Expense not found' });
  }
  const updatedExpense = {
    id,
    name: req.body.name || originalExpenses[index].name,
    description: req.body.description || originalExpenses[index].description,
    price: parseFloat(req.body.price) || originalExpenses[index].price,
    date: originalExpenses[index].date,
  };
  originalExpenses[index] = updatedExpense;
  fs.writeFileSync('expenses.json', JSON.stringify(originalExpenses));
  res.json(updatedExpense);
  // Atualiza o total com as despesas novamente
  updateTotal();
  console.table(expense);

});

router.delete('/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = originalExpenses.findIndex((expense) => expense.id === id);
  if (index === -1) {
    return res.status(404).json({ message: 'Expense not found' });
  }
  originalExpenses.splice(index, 1);
  fs.writeFileSync('expenses.json', JSON.stringify(originalExpenses));
  res.status(204).end();
  // Atualiza o total com as despesas novamente
  updateTotal();
});

// Atualiza o total das despesas

function updateTotal() {
  const total = originalExpenses.reduce((total, expense) => total + expense.price, 0);
  fs.writeFileSync('total.json', JSON.stringify(total));
}

// Rota para ler o total das despesas

router.get('/total', (req, res) => {
  try {
    const data = fs.readFileSync('total.json');
    const total = JSON.parse(data);
    console.table(data);
    console.table("Total: " + total)

    res.json({ total });
  } catch (error) {
    console.error('Error reading total.json:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

export default router;