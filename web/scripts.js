document.addEventListener('DOMContentLoaded', () => {
    const registerForm = document.getElementById('registerForm');
    const successMessage = document.getElementById('successMessage');

    if (registerForm) {
        registerForm.addEventListener('submit', async (event) => {
            event.preventDefault();

            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;

            // Validação de e-mail
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                alert('Por favor, insira um e-mail válido.');
                return;
            }

            // Enviar dados para o servidor
            const response = await fetch('http://localhost:3000/users', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email }),
            });

            if (response.ok) {
                successMessage.style.display = 'block';
                registerForm.reset();
            } else {
                alert('Erro ao cadastrar usuário. Tente novamente.');
            }
        });
    }
});
document.addEventListener('DOMContentLoaded', () => {
    const board = document.querySelector('.tasks-board');

    // Função para buscar tarefas do banco
    async function fetchTasks() {
        const response = await fetch('http://localhost:3000/tasks');
        const tasks = await response.json();
        renderTasks(tasks);
    }

    // Função para renderizar tarefas no Kanban
    function renderTasks(tasks) {
        board.innerHTML = ''; // Limpa o conteúdo anterior

        const columns = {
            'A Fazer': [],
            'Fazendo': [],
            'Pronto': []
        };

        tasks.forEach(task => {
            columns[task.status].push(`
                <div class="task-card">
                    <p><strong>Descrição:</strong> ${task.description}</p>
                    <p><strong>Setor:</strong> ${task.sector}</p>
                    <p><strong>Prioridade:</strong> ${task.priority}</p>
                    <p><strong>Usuário:</strong> ${task.user.name}</p>
                    <div class="actions">
                        <button class="edit" onclick="editTask(${task.id})">Editar</button>
                        <button class="delete" onclick="deleteTask(${task.id})">Excluir</button>
                    </div>
                    <div class="status-update">
                        <select id="status-${task.id}">
                            <option value="A Fazer" ${task.status === 'A Fazer' ? 'selected' : ''}>A Fazer</option>
                            <option value="Fazendo" ${task.status === 'Fazendo' ? 'selected' : ''}>Fazendo</option>
                            <option value="Pronto" ${task.status === 'Pronto' ? 'selected' : ''}>Pronto</option>
                        </select>
                        <button class="update" onclick="updateStatus(${task.id})">Atualizar</button>
                    </div>
                </div>
            `);
        });

        Object.keys(columns).forEach(status => {
            const column = document.createElement('div');
            column.classList.add('task-column');
            column.innerHTML = `
                <h2>${status}</h2>
                ${columns[status].join('')}
            `;
            board.appendChild(column);
        });
    }

    // Função para editar tarefa
    function editTask(taskId) {
        window.location.href = `register-task.html?taskId=${taskId}`;
    }

    // Função para excluir tarefa
    async function deleteTask(taskId) {
        if (confirm('Tem certeza que deseja excluir esta tarefa?')) {
            await fetch(`http://localhost:3000/tasks/${taskId}`, { method: 'DELETE' });
            fetchTasks();
        }
    }

    // Função para atualizar status da tarefa
    async function updateStatus(taskId) {
        const status = document.getElementById(`status-${taskId}`).value;
        await fetch(`http://localhost:3000/tasks/${taskId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status }),
        });
        fetchTasks();
    }

    // Carregar tarefas ao iniciar a página
    fetchTasks();
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