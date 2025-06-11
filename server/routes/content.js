const express = require('express');
const supabase = require('../config/database');

const router = express.Router();

// Get site content
router.get('/', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('site_content')
      .select('*');

    if (error) throw error;

    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;