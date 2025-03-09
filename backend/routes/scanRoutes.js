const express = require('express');
const multer = require('multer');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const db = require('../config/database'); // Import the database module

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });


const genAI = new GoogleGenerativeAI("AIzaSyBw1PEE5niFRQNryje36kQvN_D6y8s86eQ");

router.post('/', upload.single('document'), async (req, res) => {
  try {
    const userId = req.body.userId; 

    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }


    db.get('SELECT credits FROM users WHERE id = ?', [userId], async (err, user) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ error: 'Database error' });
      }

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      if (user.credits <= 0) {
        return res.status(403).json({ error: 'Insufficient credits' });
      }

      // Deduct 1 credit
      const newCredits = user.credits - 1;
      db.run('UPDATE users SET credits = ? WHERE id = ?', [newCredits, userId], async (updateErr) => {
        if (updateErr) {
          console.error('Failed to update credits:', updateErr);
          return res.status(500).json({ error: 'Failed to update credits' });
        }


        if (!req.file) {
          return res.status(400).json({ error: 'No document uploaded' });
        }

        if (req.file.mimetype !== 'text/plain') {
          return res.status(400).json({ error: 'Only .txt files allowed' });
        }

        const textContent = req.file.buffer.toString('utf-8');
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

        const result = await model.generateContent(`Analyze this document and provide key insights: ${textContent}`);
        const response = await result.response;
        const generatedText = response.text();


        db.run(
          'INSERT INTO documents (user_id, filename, content, extracted_text) VALUES (?, ?, ?, ?)',
          [userId, req.file.originalname, textContent, generatedText],
          function (insertErr) {
            if (insertErr) {
              console.error('Failed to save document:', insertErr);
              return res.status(500).json({ error: 'Failed to save document' });
            }

            res.json({
              success: true,
              analysis: generatedText,
              originalText: textContent,
              remainingCredits: newCredits
            });
          }
        );
      });
    });
  } catch (error) {
    console.error('Full error:', error);
    res.status(500).json({
      error: 'Document processing failed',
      details: error.message
    });
  }
});

module.exports = router;
