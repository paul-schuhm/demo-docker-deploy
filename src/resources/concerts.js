const express = require('express');

function createConcertRouter(service) {
  const router = express.Router();
  
  console.log('GET /concerts...');

  router.get('/concerts', async (req, res) => {
    const concerts = await service.getAllConcerts();
    res.json(concerts);
  });

  return router;
}

module.exports = { createConcertRouter };