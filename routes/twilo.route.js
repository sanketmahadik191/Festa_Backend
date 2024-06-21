import express from 'express';
import { getTwilo } from '../controllers/twilo.controller.js';


const router = express.Router();

router.post('/add',getTwilo);

export default router;