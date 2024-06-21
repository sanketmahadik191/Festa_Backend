import express from 'express';
import { createMenu ,getMenuById,getMenus,deleteMenu,updateMenu } from '../controllers/menu.controllers.js';
import { verifyToken } from '../utils/verifyUser.js';


const router = express.Router();

router.post('/menus',verifyToken , createMenu);
router.get('/menus', getMenus);
router.get('/menus/:id', getMenuById);
router.put('/menus/:id', updateMenu);
router.delete('/menus/:id', deleteMenu);

export default router;