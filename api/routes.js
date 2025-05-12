// Rota para criar um usuário
app.post('/users', async (req, res) => {
    const { name, email } = req.body;

    // Validação simples de e-mail no back-end
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ error: 'E-mail inválido' });
    }

    try {
        const user = await prisma.user.create({ data: { name, email } });
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao cadastrar usuário' });
    }
});

// Rota para listar usuários
app.get('/users', async (req, res) => {
    const users = await prisma.user.findMany();
    res.json(users);
});

// Rota para criar uma tarefa
app.post('/tasks', async (req, res) => {
    const { description, sector, priority, userId } = req.body;

    try {
        const task = await prisma.task.create({
            data: { description, sector, priority, userId, status: 'A Fazer' },
        });
        res.json(task);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao cadastrar tarefa' });
    }
});
// Rota para listar tarefas com usuário vinculado
app.get('/tasks', async (req, res) => {
    const tasks = await prisma.task.findMany({
        include: { user: true },
    });
    res.json(tasks);
});

// Rota para atualizar status da tarefa
app.put('/tasks/:id', async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    try {
        const task = await prisma.task.update({
            where: { id: parseInt(id) },
            data: { status },
        });
        res.json(task);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao atualizar tarefa' });
    }
});

// Rota para excluir tarefa
app.delete('/tasks/:id', async (req, res) => {
    const { id } = req.params;

    try {
        await prisma.task.delete({ where: { id: parseInt(id) } });
        res.json({ message: 'Tarefa excluída com sucesso' });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao excluir tarefa' });
    }
});