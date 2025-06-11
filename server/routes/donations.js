const express = require('express');
const supabase = require('../config/database');

const router = express.Router();

// Create donation
router.post('/', async (req, res) => {
  try {
    const { amount, donor_name, donor_email, message } = req.body;

    const { data, error } = await supabase
      .from('donations')
      .insert([
        {
          amount,
          donor_name,
          donor_email,
          message,
          created_at: new Date().toISOString()
        }
      ])
      .select();

    if (error) throw error;

    res.status(201).json({ message: 'Donation recorded successfully', donation: data[0] });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get all donations
router.get('/', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('donations')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;