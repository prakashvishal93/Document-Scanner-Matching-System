const db = require('../config/database');

// Get User Profile
const getUserProfile = (req, res) => {
  const userId = req.user.id; 

  db.get('SELECT * FROM users WHERE id = ?', [userId], (err, user) => {
    if (err || !user) return res.status(400).send("User not found");

    // Get user's documents
    db.all('SELECT * FROM documents WHERE user_id = ?', [userId], (err, documents) => {
      if (err) return res.status(500).send("Error retrieving documents");

      // Get credit requests
      db.all('SELECT * FROM credit_requests WHERE user_id = ?', [userId], (err, requests) => {
        if (err) return res.status(500).send("Error retrieving credit requests");


        res.json({
          user: {
            id: user.id, // Include userId
            username: user.username,
            role: user.role,
            credits: user.credits,
            last_reset: user.last_reset
          },
          documents,
          requests
        });
      });
    });
  });
};

module.exports = {
  getUserProfile
};
