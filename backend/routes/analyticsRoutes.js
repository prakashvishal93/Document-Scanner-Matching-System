const express = require('express');
const db = require('../config/database');
const stringSimilarity = require('string-similarity');

const router = express.Router();

router.get('/analytics', (req, res) => {

  db.get('SELECT * FROM documents ORDER BY upload_date DESC LIMIT 1', (latestErr, latestDoc) => {
    if (latestErr) {
      console.error('Error fetching latest document:', latestErr);
      return res.status(500).json({ error: 'Failed to fetch latest document' });
    }

    if (!latestDoc || !latestDoc.content) {
      return res.status(404).json({ error: 'No documents available for analysis' });
    }

    const textContent = latestDoc.content;

    db.all('SELECT * FROM documents WHERE id != ?', [latestDoc.id], (err, docs) => {
      if (err) {
        console.error('Failed to fetch documents for similarity matching:', err);
        return res.status(500).json({ error: 'Failed to fetch documents' });
      }

      const matches = docs.map(doc => {
        const similarity = stringSimilarity.compareTwoStrings(
          textContent.toLowerCase(),
          (doc.extracted_text || '').toLowerCase()
        );
        return { ...doc, similarity: similarity.toFixed(2) };
      });

      matches.sort((a, b) => b.similarity - a.similarity);
      const bestMatch = matches.length ? matches[0] : null;

      res.json({
        success: true,
        originalText: textContent,
        match: bestMatch && bestMatch.similarity > 0.3 ? bestMatch : null
      });
    });
  });
});

module.exports = router;
