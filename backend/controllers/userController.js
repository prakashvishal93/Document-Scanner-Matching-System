const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/database');


const registerUser = (req, res) => {
  const { username, password, role } = req.body;


  if (!username || !password || !role) {
    return res.status(400).json({ message: "Username, password, and role are required" });
  }

  const userRole = role === 'admin' ? 'admin' : 'user';

  bcrypt.hash(password, 10, (err, hashedPassword) => {
    if (err) {
      return res.status(500).json({ message: "Error hashing password" });
    }

    const stmt = db.prepare("INSERT INTO users (username, password, role) VALUES (?, ?, ?)");
    stmt.run(username, hashedPassword, userRole, function (err) {
      if (err) {
        return res.status(500).json({ message: "Error registering user" });
      }
      res.status(201).json({ message: "User registered successfully" });
    });
  });
};


const loginUser = (req, res) => {
  const { username, password } = req.body;


  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  db.get('SELECT * FROM users WHERE username = ?', [username], (err, user) => {
    if (err || !user) {
      return res.status(400).json({ message: "Invalid username or password" });
    }

    bcrypt.compare(password, user.password, (err, isMatch) => {
      if (!isMatch) {
        return res.status(400).json({ message: "Invalid password" });
      }


      const token = jwt.sign({ id: user.id, role: user.role }, 'secret_key', { expiresIn: '1h' });
      res.json({ token });
    });
  });
};


module.exports = {
  registerUser,
  loginUser
};