import express from 'express';
import { addRestaurant, getRest,getRestById,showRestList } from '../controllers/rest.controller.js';
import { verifyToken } from '../utils/verifyUser.js';


const router = express.Router();

router.post('/add',verifyToken,addRestaurant);
router.post('/list',verifyToken,showRestList);
router.get('/getRest',verifyToken,getRest);
router.get('/getRest/:id',verifyToken,getRestById);

export default router;