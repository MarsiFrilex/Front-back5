// DOM Elements
const registerForm = document.getElementById('registerForm');
const loginForm = document.getElementById('loginForm');
const registerMessage = document.getElementById('registerMessage');
const loginMessage = document.getElementById('loginMessage');
const protectedSection = document.getElementById('protectedSection');
const protectedContent = document.getElementById('protectedContent');
const logoutBtn = document.getElementById('logoutBtn');
const getDataBtn = document.getElementById('getDataBtn');

// сюда url бэкенда
const API_BASE_URL = 'http://localhost:3000';

registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const username = document.getElementById('regUsername').value;
    const email = document.getElementById('regEmail').value;
    const password = document.getElementById('regPassword').value;
    
    try {
        const response = await fetch(`${API_BASE_URL}/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, email, password })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            showMessage(registerMessage, 'Успешная регистрация! <3', 'success');
            registerForm.reset();
        } else {
            showMessage(registerMessage, data.message || 'Ошибка регистрации', 'error');
        }
    } catch (error) {
        showMessage(registerMessage, 'Произошла ошибка при регистрации:', 'error');
        console.error('Ошибка регистрации:', error);
    }
});

loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const username = document.getElementById('loginUsername').value;
    const password = document.getElementById('loginPassword').value;
    
    try {
        const response = await fetch(`${API_BASE_URL}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            // Store the token
            localStorage.setItem('jwtToken', data.token);
            showMessage(loginMessage, 'Успешный вход! <3', 'success');
            loginForm.reset();
            
            // Show protected section
            protectedSection.classList.remove('hidden');
        } else {
            showMessage(loginMessage, data.message || 'Ошибка авторизации.', 'error');
        }
    } catch (error) {
        showMessage(loginMessage, 'Возникла ошибка при авторизации', 'error');
        console.error('Ошибка авторизации:', error);
    }
});

logoutBtn.addEventListener('click', () => {
    localStorage.removeItem('jwtToken');
    protectedSection.classList.add('hidden');
    showMessage(loginMessage, 'Осуществлён выход', 'success');
});

getDataBtn.addEventListener('click', async () => {
    const token = localStorage.getItem('jwtToken');
    
    if (!token) {
        protectedContent.innerHTML = '<p class="error">Токен не найден, авторизуйтесь.</p>';
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE_URL}/protected`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (response.ok) {
            const data = await response.json();
            protectedContent.innerHTML = `
                <p>Полученные данные:</p>
                <pre>${JSON.stringify(data, null, 2)}</pre>
            `;
        } else {
            protectedContent.innerHTML = '<p class="error">Ошибка получения защищённых данных</p>';
        }
    } catch (error) {
        protectedContent.innerHTML = '<p class="error">Ошибка получения защищённых данных</p>';
        console.error('Ошибка:', error);
    }
});

document.addEventListener('DOMContentLoaded', () => { // проверяет, залогинен ли пользователь
    const token = localStorage.getItem('jwtToken');
    if (token) {
        protectedSection.classList.remove('hidden');
    }
});

function showMessage(element, message, type) {
    element.textContent = message;
    element.className = `message ${type}`;
    element.classList.remove('hidden');
    
    setTimeout(() => {
        element.classList.add('hidden');
    }, 5000);
}