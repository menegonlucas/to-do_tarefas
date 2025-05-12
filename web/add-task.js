document.addEventListener('DOMContentLoaded', () => {
    const taskForm = document.getElementById('taskForm');
    const successMessage = document.getElementById('successMessage');
    const userSelect = document.getElementById('userId');

    // Função para carregar usuários do banco
    async function loadUsers() {
        const response = await fetch('http://localhost:3000/users');
        const users = await response.json();

        users.forEach(user => {
            const option = document.createElement('option');
            option.value = user.id;
            option.textContent = user.name;
            userSelect.appendChild(option);
        });
    }

    // Função para cadastrar tarefa
    if (taskForm) {
        taskForm.addEventListener('submit', async (event) => {
            event.preventDefault();

            const description = document.getElementById('description').value;
            const sector = document.getElementById('sector').value;
            const priority = document.getElementById('priority').value;
            const userId = document.getElementById('userId').value;

            const response = await fetch('http://localhost:3000/tasks', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ description, sector, priority, userId }),
            });

            if (response.ok) {
                successMessage.style.display = 'block';
                taskForm.reset();
            } else {
                alert('Erro ao cadastrar tarefa. Tente novamente.');
            }
        });
    }

    // Carregar usuários ao abrir a página
    if (userSelect) {
        loadUsers();
    }
});