const express = require('express');
const router = express.Router();
const RouteController = require('../controllers/route.controller');
const { protect } = require('../middlewares/auth.middleware');
const { authorize } = require('../middlewares/rbac.middleware');

// Public route to view available routes
router.get('/', RouteController.getRoutes);

// Protected routes are now handled under /saccos/routes

module.exports = router;
