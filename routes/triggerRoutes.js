// triggerRoutes.js
import express from 'express';
import { triggerCountry, triggerGoogleAnalytics } from '../controller/triggerController.js';
import protectRoute from '../middlewares/protectRoutes.js';

const router = express.Router();

// Route to trigger only Google Analytics report
router.get('/trigger-analytics',protectRoute, triggerGoogleAnalytics);

// Route to trigger only Country-level report
router.get('/trigger-country',protectRoute, triggerCountry);

export default router;
