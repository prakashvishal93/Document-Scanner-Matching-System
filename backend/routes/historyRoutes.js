const express = require('express');
const router = express.Router(); 
const db = require('../config/database'); 


router.get('/history/:userId', (req, res) => {
    const userId = req.params.userId;

    if (!userId) {
        return res.status(400).json({ error: 'User ID is required' });
    }

    db.all(
        'SELECT id, filename, content, upload_date FROM documents WHERE user_id = ? ORDER BY upload_date DESC', 
        [userId], 
        (err, rows) => {
            if (err) {
                console.error('Database error:', err);
                return res.status(500).json({ error: 'Database error' });
            }

            res.json({
                success: true,
                documents: rows
            });
        }
    );
});

module.exports = router; 
