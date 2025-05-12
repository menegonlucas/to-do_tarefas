// Função para buscar tarefas
async function fetchTasks() {
    const response = await fetch('http://localhost:3000/tasks');
    const tasks = await response.json();
    renderTasks(tasks);
}

// Função para renderizar tarefas na página
function renderTasks(tasks) {
    const board = document.querySelector('.tasks-board');
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
                <p><strong>Prioridade:</strong> ${task.priority}</p>
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

// Função para adicionar uma nova tarefa
async function addTask(event) {
    event.preventDefault();
    const description = document.querySelector('#description').value;
    const sector = document.querySelector('#sector').value;
    const priority = document.querySelector('#priority').value;

    await fetch('http://localhost:3000/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ description, sector, priority, userId: 1 }) // Substitua userId conforme necessário
    });

    window.location.href = 'view-task.html'; // Redireciona para a página de visualização
}

// Adiciona evento ao formulário de adicionar tarefa
const form = document.querySelector('form');
if (form) {
    form.addEventListener('submit', addTask);
}

// Carrega as tarefas ao abrir a página de visualização
if (window.location.pathname.includes('view-task.html')) {
    fetchTasks();
}