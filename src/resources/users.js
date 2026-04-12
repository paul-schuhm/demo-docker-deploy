const express = require('express');

function createUserRouter(service) {

  const router = express.Router();
  
  router.get('/users', async (req, res) => {
    const users = await service.users();
    res.json(users);
  });

  return router;
}

module.exports = { createUserRouter };