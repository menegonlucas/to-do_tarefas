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