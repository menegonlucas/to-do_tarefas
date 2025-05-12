const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

// Rota para criar um usuário
app.post('/users', async (req, res) => {
    const { name, email } = req.body;
    const user = await prisma.user.create({ data: { name, email } });
    res.json(user);
});

// Rota para criar uma tarefa
app.post('/tasks', async (req, res) => {
    const { description, sector, priority, userId } = req.body;
    const task = await prisma.task.create({
        data: { description, sector, priority, userId, status: 'A Fazer' },
    });
    res.json(task);
});

// Rota para listar todas as tarefas
app.get('/tasks', async (req, res) => {
    const tasks = await prisma.task.findMany();
    res.json(tasks);
});

// Rota para atualizar uma tarefa
app.put('/tasks/:id', async (req, res) => {
    const { id } = req.params;
    const { status, priority } = req.body;
    const task = await prisma.task.update({
        where: { id: parseInt(id) },
        data: { status, priority },
    });
    res.json(task);
});

// Rota para deletar uma tarefa
app.delete('/tasks/:id', async (req, res) => {
    const { id } = req.params;
    await prisma.task.delete({ where: { id: parseInt(id) } });
    res.json({ message: 'Tarefa excluída com sucesso' });
});

app.listen(3000, () => console.log('Servidor rodando na porta 3000'));