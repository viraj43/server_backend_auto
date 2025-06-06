import express from 'express';
import { login , logout} from '../controller/authController.js'; // import the login function from your controller

const router = express.Router();

// Define the login route
router.post('/login', login);

router.post('/logout', logout);


export default router;
