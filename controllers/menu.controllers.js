import  Menu from '../models/menu.model.js'
import Restaurant from '../models/restaurant.model.js';


export const createMenu = async (req, res) => {
  try {
      const menu = new Menu(req.body);
      await menu.save();

      const restaurantId = req.user.restaurantId;
      const restaurant = await Restaurant.findById(restaurantId);
      if (!restaurant) {
          return res.status(404).send();
      }
      restaurant.menu = menu._id;
      await restaurant.save();
      res.status(201).send(menu);
  } catch (error) {
      res.status(400).send(error);
  }
};

export const getMenus = async (req, res) => {
  try {
      const menus = await Menu.find();
      res.status(200).send(menus);
  } catch (error) {
      res.status(500).send(error);
  }
};

export const getMenuById = async (req, res) => {
  try {
      const menu = await Menu.findById(req.params.id);
      if (!menu) {
          return res.status(404).send();
      }
      res.status(200).send(menu);
  } catch (error) {
      res.status(500).send(error);
  }
};

export const updateMenu = async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ['categories'];
  const isValidOperation = updates.every(update => allowedUpdates.includes(update));

  if (!isValidOperation) {
      return res.status(400).send({ error: 'Invalid updates!' });
  }

  try {
      const menu = await Menu.findById(req.params.id);

      if (!menu) {
          return res.status(404).send();
      }

      updates.forEach(update => menu[update] = req.body[update]);
      await menu.save();
      res.send(menu);
  } catch (error) {
      res.status(400).send(error);
  }
};

export const deleteMenu = async (req, res) => {
  try {
      const menu = await Menu.findByIdAndDelete(req.params.id);

      if (!menu) {
          return res.status(404).send();
      }

      res.send(menu);
  } catch (error) {
      res.status(500).send(error);
  }
};
