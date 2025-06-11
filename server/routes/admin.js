const express = require('express');
const { authenticateToken } = require('../middleware/auth');
const supabase = require('../config/database');

const router = express.Router();

// Get admin dashboard data
router.get('/dashboard', authenticateToken, async (req, res) => {
  try {
    // Get total donations
    const { data: donations, error: donationsError } = await supabase
      .from('donations')
      .select('amount');

    if (donationsError) throw donationsError;

    const totalDonations = donations.reduce((sum, donation) => sum + donation.amount, 0);

    // Get user count
    const { count: userCount, error: userError } = await supabase
      .from('profiles')
      .select('*', { count: 'exact' });

    if (userError) throw userError;

    res.json({
      totalDonations,
      userCount,
      recentDonations: donations.slice(-5)
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;