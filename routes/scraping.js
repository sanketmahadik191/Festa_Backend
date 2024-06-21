import express from 'express';
import { scraping } from '../controllers/scraping.js';

const router = express.Router();

router.get('/scrape',scraping);

export default router;