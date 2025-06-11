const express = require('express');
const supabase = require('../config/database');

const router = express.Router();

// Get all testimonials
router.get('/', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('testimonials')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Create testimonial
router.post('/', async (req, res) => {
  try {
    const { name, content, rating } = req.body;

    const { data, error } = await supabase
      .from('testimonials')
      .insert([
        {
          name,
          content,
          rating,
          created_at: new Date().toISOString()
        }
      ])
      .select();

    if (error) throw error;

    res.status(201).json({ message: 'Testimonial created successfully', testimonial: data[0] });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;