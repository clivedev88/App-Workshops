document.addEventListener('DOMContentLoaded', function() {
    const themeToggle = document.getElementById('theme-toggle');
    const loginForm = document.getElementById('login-form');
    const registerLink = document.getElementById('go-to-register');

    // Apply the saved theme if it exists
    const savedTheme = localStorage.getItem('theme') || 'light';
    applyTheme(savedTheme);

    themeToggle.addEventListener('click', function() {
        const newTheme = document.body.classList.contains('dark') ? 'light' : 'dark';
        applyTheme(newTheme);
    });

    registerLink.addEventListener('click', function() {
        displayRegisterPage();
    });

    loginForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const name = document.getElementById('login-name').value;
        const password = document.getElementById('login-password').value;
        loginUser(name, password);
    });

    setupWebSocket();
});

function applyTheme(theme) {
    document.body.className = theme;
    localStorage.setItem('theme', theme);
    document.getElementById('theme-toggle').textContent = `Tema: ${theme === 'light' ? 'Claro' : 'Escuro'}`;
}

function displayNotification(message, type) {
    const notificationContainer = document.getElementById('notification-container');
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    notificationContainer.appendChild(notification);
    setTimeout(() => {
        notificationContainer.removeChild(notification);
    }, 3000);
}

function displayRegisterPage() {
    document.body.innerHTML = `
    <div id="theme-switcher">
        <button id="theme-toggle">Tema: ${document.body.classList.contains('dark') ? 'Escuro' : 'Claro'}</button>
    </div>
    <div id="register-container">
        <h2>Cadastro</h2>
        <form id="register-form">
            <input type="text" id="register-name" placeholder="Nome" required>
            <input type="password" id="register-password" placeholder="Senha" required>
            <input type="password" id="register-confirm-password" placeholder="Confirmar Senha" required>
            <input type="email" id="register-email" placeholder="Email" required>
            <select id="register-course">
                <option value="Design">Design</option>
                <option value="Marketing">Marketing</option>
                <option value="Programação">Programação</option>
            </select>
            <button type="submit">Cadastrar</button>
        </form>
        <p>Já tem uma conta? <a href="#" id="go-to-login">Login</a></p>
    </div>
    <div id="notification-container"></div>
    `;

    const themeToggle = document.getElementById('theme-toggle');
    themeToggle.addEventListener('click', function() {
        const newTheme = document.body.classList.contains('dark') ? 'light' : 'dark';
        applyTheme(newTheme);
    });

    const registerForm = document.getElementById('register-form');
    const loginLink = document.getElementById('go-to-login');

    registerForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const name = document.getElementById('register-name').value;
        const password = document.getElementById('register-password').value;
        const confirmPassword = document.getElementById('register-confirm-password').value;
        const email = document.getElementById('register-email').value;
        const course = document.getElementById('register-course').value;

        if (password !== confirmPassword) {
            displayNotification('As senhas não coincidem.', 'error');
            return;
        }

        registerUser(name, password, email, course);
    });

    loginLink.addEventListener('click', function() {
        location.reload();
    });
}

function registerUser(name, password, email, course) {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    users.push({ name, password, email, course, workshops: [] });
    localStorage.setItem('users', JSON.stringify(users));
    displayNotification('Cadastro realizado com sucesso!', 'success');
    setTimeout(() => {
        location.reload();
    }, 1500);
}

function loginUser(name, password) {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const user = users.find(user => user.name === name && user.password === password);
    if (user) {
        localStorage.setItem('loggedInUser', JSON.stringify(user));
        displayMainPage(user);
    } else {
        displayNotification('Nome ou senha incorretos.', 'error');
    }
}

function displayMainPage(user) {
    document.body.innerHTML = `
    <div id="theme-switcher">
        <button id="theme-toggle">Tema: ${document.body.classList.contains('dark') ? 'Escuro' : 'Claro'}</button>
    </div>
    <div id="main-container">
        <button id="logout">Sair</button>
        <h2>Bem-vindo, ${user.name}</h2>
        <div id="profile">
            <h3>Perfil</h3>
            <p>Email: ${user.email}</p>
            <p>Curso: ${user.course}</p>
            <button id="edit-profile">Editar Perfil</button>
        </div>
        <div id="workshops">
            <h3>Workshops</h3>
            <input type="text" id="workshop-search" placeholder="Pesquisar workshops">
            <button id="view-workshops">Ver Workshops</button>
            <button id="view-calendar">Ver Calendário</button>
            <ul id="workshops-list">${user.workshops.map(w => `<li>${w}</li>`).join('')}</ul>
        </div>
    </div>
    <div id="notification-container"></div>
    `;

    const themeToggle = document.getElementById('theme-toggle');
    themeToggle.addEventListener('click', function() {
        const newTheme = document.body.classList.contains('dark') ? 'light' : 'dark';
        applyTheme(newTheme);
    });

    document.getElementById('logout').addEventListener('click', function() {
        localStorage.removeItem('loggedInUser');
        location.reload();
    });

    document.getElementById('edit-profile').addEventListener('click', function() {
        editProfile(user);
    });

    document.getElementById('view-workshops').addEventListener('click', function() {
        displayWorkshops(user);
    });

    document.getElementById('view-calendar').addEventListener('click', function() {
        displayCalendar(user);
    });

    document.getElementById('workshop-search').addEventListener('input', function() {
        const query = this.value.toLowerCase();
        filterWorkshops(query, user);
    });

    // Schedule notifications for upcoming workshops (for demonstration purposes)
    setTimeout(() => {
        displayNotification('Lembrete: Você tem um workshop de Design amanhã!', 'success');
    }, 5000);
}

function editProfile(user) {
    document.body.innerHTML = `
    <div id="theme-switcher">
        <button id="theme-toggle">Tema: ${document.body.classList.contains('dark') ? 'Escuro' : 'Claro'}</button>
    </div>
    <div id="edit-profile-container">
        <h2>Editar Perfil</h2>
        <form id="edit-profile-form">
            <input type="text" id="edit-name" placeholder="Nome" value="${user.name}" required>
            <input type="email" id="edit-email" placeholder="Email" value="${user.email}" required>
            <select id="edit-course">
                <option value="Design" ${user.course === 'Design' ? 'selected' : ''}>Design</option>
                <option value="Marketing" ${user.course === 'Marketing' ? 'selected' : ''}>Marketing</option>
                <option value="Programação" ${user.course === 'Programação' ? 'selected' : ''}>Programação</option>
            </select>
            <button type="submit">Salvar</button>
        </form>
        <button id="cancel-edit">Cancelar</button>
    </div>
    <div id="notification-container"></div>
    `;

    const themeToggle = document.getElementById('theme-toggle');
    themeToggle.addEventListener('click', function() {
        const newTheme = document.body.classList.contains('dark') ? 'light' : 'dark';
        applyTheme(newTheme);
    });

    document.getElementById('edit-profile-form').addEventListener('submit', function(event) {
        event.preventDefault();
        user.name = document.getElementById('edit-name').value;
        user.email = document.getElementById('edit-email').value;
        user.course = document.getElementById('edit-course').value;
        localStorage.setItem('loggedInUser', JSON.stringify(user));
        const users = JSON.parse(localStorage.getItem('users')) || [];
        const userIndex = users.findIndex(u => u.email === user.email);
        users[userIndex] = user;
        localStorage.setItem('users', JSON.stringify(users));
        displayNotification('Perfil atualizado com sucesso!', 'success');
        setTimeout(() => {
            displayMainPage(user);
        }, 1500);
    });

    document.getElementById('cancel-edit').addEventListener('click', function() {
        displayMainPage(user);
    });
}

function displayWorkshops(user) {
    const workshops = [
        {
            title: 'Marketing Digital 101',
            image: 'marketing.jpg',
            description: 'Introdução ao marketing digital, abordando SEO, mídias sociais e estratégias de conteúdo para engajar e expandir seu público.',
            teacher: 'Prof. Ana Ferreira',
            date: '2023-07-15',
        },
        
        {
            title: 'Estratégias de Conteúdo',
            image: 'marketing.jpg',
            description: 'Aprenda a criar e gerenciar conteúdo que fala com seu público-alvo e constrói uma comunidade fiel.',
            teacher: 'Prof. Roberto Dias',
            date: '2023-07-29',
        },
        {
            title: 'Análise de Dados para Marketing',
            image: 'marketing.jpg',
            description: 'Use dados para entender comportamentos de consumidores e tomar decisões de marketing mais informadas.',
            teacher: 'Prof. Lúcia Moura',
            date: '2023-08-12',
        },
        {
            title: 'Introdução à Programação com Python',
            image: 'programacao.jpg',
            description: 'Comece sua jornada na programação aprendendo Python, uma das linguagens mais populares e versáteis.',
            teacher: 'Prof. Rafael Santos',
            date: '2023-07-20',
        },
        {
            title: 'Desenvolvimento Web Front-End',
            image: 'programacao.jpg',
            description: 'Domine as tecnologias e front-end como HTML, CSS e JavaScript para criar sites responsivos e interativos.',
            teacher: 'Prof. Beatriz Oliveira',
            date: '2023-08-03',
        },
        
        {
            title: 'Fundamentos de Banco de Dados',
            image: 'programacao.jpg',
            description: 'Entenda os conceitos de banco de dados relacionais e não-relacionais e como manipular dados eficientemente.',
            teacher: 'Prof. Thiago Gomes',
            date: '2023-12-10',
        },
        {
            title: 'Fundamentos de Design Gráfico',
            image: 'design.jpg',
            description: 'Explore os princípios básicos do design gráfico, desde a teoria das cores até a tipografia, e aprenda a criar visuaiss impactantes.',
            teacher: 'Prof. Carlos Silva',
            date: '2023-07-10',
        },
        {
            title: 'UX/UI para Iniciantes',
            image: 'design.jpg',
            description: 'Entenda os conceitos de UX/UI e como eles melhoram a experiência do usuário em aplicativos e websites.',
            teacher: 'Prof. Marina Costa',
            date: '2023-07-24',
        },
        {
            title: 'Branding e Identidade Visual',
            image: 'design.jpg',
            description: 'Crie marcas memoráveis e aprenda a desenvolver uma idantidade visual coesa para emoresas e produtos.',
            teacher: 'Prof. João Pereira',
            date: '2023-08-07',
        }
    ];

    document.body.innerHTML = `
    <div id="theme-switcher">
        <button id="theme-toggle">Tema: ${document.body.classList.contains('dark') ? 'Escuro' : 'Claro'}</button>
    </div>
    <div id="workshops-container">
        <button id="back-to-main">Voltar</button>
        <h2>Workshops</h2>
        <input type="text" id="workshop-search" placeholder="Pesquisar workshops">
        ${workshops.map(workshop => `
            <div class="workshop">
                <h3>${workshop.title}</h3>
                <img src="${workshop.image}" alt="${workshop.title}">
                <p>${workshop.description}</p>
                <p>Professor: ${workshop.teacher}</p>
                <p>Data: ${workshop.date}</p>
                <button class="enroll-workshop" data-title="${workshop.title}" data-date="${workshop.date}">${user.workshops.includes(workshop.title) ? 'Desinscrever' : 'Inscrever'}</button>
                <textarea class="feedback" placeholder="Deixe seu feedback aqui..." oninput="autoGrow(this)"></textarea>
                <button class="submit-feedback" data-title="${workshop.title}">Enviar Feedback</button>
            </div>
        `).join('')}
    </div>
    <div id="notification-container"></div>
    `;

    const themeToggle = document.getElementById('theme-toggle');
    themeToggle.addEventListener('click', function() {
        const newTheme = document.body.classList.contains('dark') ? 'light' : 'dark';
        applyTheme(newTheme);
    });

    document.getElementById('back-to-main').addEventListener('click', function() {
        displayMainPage(user);
    });

    document.querySelectorAll('.enroll-workshop').forEach(button => {
        button.addEventListener('click', function() {
            const workshopTitle = this.getAttribute('data-title');
            const workshopDate = this.getAttribute('data-date');
            if (user.workshops.includes(workshopTitle)) {
                if (confirm('Você tem certeza que deseja desinscrever-se deste workshop?')) {
                    user.workshops = user.workshops.filter(w => w !== workshopTitle);
                    displayNotification('Desinscrito com sucesso!', 'success');
                } else {
                    return;
                }
            } else {
                user.workshops.push(workshopTitle);
                displayNotification('Inscrito com sucesso!', 'success');
            }
            localStorage.setItem('loggedInUser', JSON.stringify(user));
            const users = JSON.parse(localStorage.getItem('users')) || [];
            const userIndex = users.findIndex(u => u.email === user.email);
            users[userIndex] = user;
            localStorage.setItem('users', JSON.stringify(users));
            setTimeout(() => {
                displayMainPage(user);
            }, 1500);
        });
    });

    document.querySelectorAll('.submit-feedback').forEach(button => {
        button.addEventListener('click', function() {
            const workshopTitle = this.getAttribute('data-title');
            const feedback = this.previousElementSibling.value;
            saveFeedback(workshopTitle, feedback);
            displayNotification('Feedback enviado com sucesso!', 'success');
        });
    });

    document.getElementById('workshop-search').addEventListener('input', function() {
        const query = this.value.toLowerCase();
        filterWorkshops(query, user);
    });
}

function autoGrow(element) {
    element.style.height = 'auto';
    element.style.height = (element.scrollHeight) + 'px';
}

function filterWorkshops(query, user) {
    const workshopElements = document.querySelectorAll('.workshop');
    workshopElements.forEach(workshop => {
        const title = workshop.querySelector('h3').textContent.toLowerCase();
        if (title.includes(query)) {
            workshop.style.display = 'block';
        } else {
            workshop.style.display = 'none';
        }
    });
}

function saveFeedback(workshopTitle, feedback) {
    const feedbacks = JSON.parse(localStorage.getItem('feedbacks')) || [];
    feedbacks.push({ workshopTitle, feedback });
    localStorage.setItem('feedbacks', JSON.stringify(feedbacks));
}

function displayCalendar(user) {
    const workshops = [
        {
            title: 'Workshop de Design',
            date: '2023-12-01',
        },
        {
            title: 'Workshop de Marketing',
            date: '2023-12-05',
        },
        {
            title: 'Workshop de Programação',
            date: '2023-12-10',
        }
    ];

    document.body.innerHTML = `
    <div id="theme-switcher">
        <button id="theme-toggle">Tema: ${document.body.classList.contains('dark') ? 'Escuro' : 'Claro'}</button>
    </div>
    <div id="calendar-container">
        <button id="back-to-main">Voltar</button>
        <h2>Calendário de Workshops</h2>
        <div id="calendar"></div>
    </div>
    <div id="notification-container"></div>
    `;

    const themeToggle = document.getElementById('theme-toggle');
    themeToggle.addEventListener('click', function() {
        const newTheme = document.body.classList.contains('dark') ? 'light' : 'dark';
        applyTheme(newTheme);
    });

    document.getElementById('back-to-main').addEventListener('click', function() {
        displayMainPage(user);
    });

    const calendarEl = document.getElementById('calendar');
    workshops.forEach(workshop => {
        const workshopEl = document.createElement('div');
        workshopEl.className = 'calendar-event';
        workshopEl.textContent = `${workshop.title} - ${workshop.date}`;
        calendarEl.appendChild(workshopEl);
    });
}

function setupWebSocket() {
    const socket = new WebSocket('wss://example.com/websocket');
    socket.onmessage = function(event) {
        const data = JSON.parse(event.data);
        if (data.type === 'notification') {
            displayNotification(data.message, 'success');
        }
    };
}
