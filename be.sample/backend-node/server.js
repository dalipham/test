const express = require('express');
const bcrypt = require('bcryptjs');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = process.env.PORT || 3000;

// Sample user data (replace this with your own user data)
const users = [
    {
        id: 1,
        username: 'user1',
        password: bcrypt.hashSync('password1', 8)  // Mật khẩu được mã hóa
    }
];

app.use(bodyParser.json());
// Cấu hình để cho phép truy cập từ tất cả các nguồn
// app.use((req, res, next) => {
//     res.setHeader('Access-Control-Allow-Origin', '*');
//     res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
//     res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
//     next();
// });

// Route for handling login
app.post('/login', (req, res) => {
    const { username, password } = req.body.credentials; // Truy cập vào credentials
    console.log(req.body)
    // Find user by username
    const user = users.find(u => u.username === username);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Check password
    const passwordIsValid = bcrypt.compareSync(password, user.password);
    if (!passwordIsValid) {
      return res.status(401).send('Invalid password');
    }

    // Generate and send JWT token
    const token = jwt.sign({ userId: user.id }, 'secretkey', { expiresIn: '1h' });
    res.json({ token });
});

// Middleware for token authentication
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token == null) return res.sendStatus(401);

    jwt.verify(token, 'secretkey', (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
}

// Example protected route
app.get('/profile', authenticateToken, (req, res) => {
    res.json(req.user);
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
