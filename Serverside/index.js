const express = require('express');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

// CORS конфигурация
app.use(cors({
  origin: 'http://127.0.0.1:5500', // сюда ставить адрес фронтенд страницы
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(bodyParser.json());

const SECRET_KEY = 'secret-key';
const users = [];

app.post('/register', (req, res) => {
    const { username, email, password } = req.body;
    
    if (users.some(u => u.username === username)) {
        return res.status(400).json({ message: 'Имя занято' });
    }
    
    users.push({ username, email, password });
    res.json({ message: 'Пользователь успешно зарегистрирован' });
});

app.post('/login', (req, res) => {
    const { username, password } = req.body;
    
    const user = users.find(u => u.username === username && u.password === password);
    
    if (user) {
        const token = jwt.sign(
            { userId: user.username, username: user.username },
            SECRET_KEY,
            { expiresIn: '1h' }
        );
        res.json({ token });
    } else {
        res.status(401).json({ message: 'Неправильные данные для входа' });
    }
});

app.get('/protected', (req, res) => {
    const token = req.headers['authorization']?.split(' ')[1];
    
    if (!token) return res.status(403).json({ message: 'Требуется токен' });
    
    jwt.verify(token, SECRET_KEY, (err, decoded) => {
        if (err) return res.status(401).json({ message: 'Неверный токен' });
        res.json({ 
            message: 'Получен доступ к защищённым данным',
            user: decoded,
            timestamp: new Date().toISOString()
        });
    });
});

app.listen(3000, () => console.log('Сервер запущен на http://localhost:3000'));