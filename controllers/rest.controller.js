import Restaurant from "../models/restaurant.model.js";
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import AWS from 'aws-sdk';
import fs from 'fs';

// Resolve __dirname for ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure the upload directory exists
const uploadStorePath = path.join(__dirname, "..", "store");
if (!fs.existsSync(uploadStorePath)) {
  fs.mkdirSync(uploadStorePath, { recursive: true });
}

// Multer setup for handling file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadStorePath),
  filename: (req, file, cb) => {
    const fileName = Date.now() + "-" + Math.round(Math.random() * 100) + path.extname(file.originalname);
    cb(null, fileName);
  },
});

const upload = multer({ storage: storage }).array("images", 4); // Adjust field name and file limit if needed

// AWS S3 Configuration
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_KEY,
  region: "us-east-1"
});

const s3 = new AWS.S3();

const getPreSignedUrl = (key) => {
  const params = {
    Bucket: "restaurant-images-store",
    Key: key,
    Expires: 60 * 60 // URL expires in 1 hour
  };

  return s3.getSignedUrl('getObject', params);
};

export const addRestaurant = async (req, res) => {
    try {
      // Extract the data from the request body
      const { name, location, tags } = req.body;
      const imageFiles = req.files;

      // Function to upload a file to S3 and return its URL
      const uploadFileToS3 = (file) => {
        const fileContent = fs.readFileSync(file.path);
        const key = `images/${Date.now()}_${file.originalname}`;
        const params = {
          Bucket: "restaurant-images-store",
          Key: key,
          Body: fileContent,
        };

        return s3.upload(params).promise().then((data) => key);
      };

      // Upload all images to S3 and get their URLs
      const uploadPromises = imageFiles.map(file => uploadFileToS3(file));
      const imageKeys = await Promise.all(uploadPromises);
      

      // Create a new Restaurant document using the Restaurant model
      const newRestaurant = new Restaurant({
        name,
        location,
        images: imageKeys,
        owner:req.user._id,
        tags: JSON.parse(tags), // Parse the tags if they are sent as a JSON string
      });

      // Save the newRestaurant document to the database
      await newRestaurant.save();

      // Respond with a success message
      res.status(201).json({ message: 'Restaurant added successfully', restaurant: newRestaurant });

    } catch (error) {
      console.error("Error adding restaurant:", error);
      res.status(500).json({ message: "Error adding restaurant" });
    }
  }

export const showRestList = async (req, res) => {
  try {
    const restaurants = await Restaurant.find();
    res.send(restaurants);
  } catch (err) {
    console.error("Error fetching restaurant list:", err);
    res.status(500).json({ message: "Error fetching restaurant list" });
  }
};

export const getRest = async (req, res) => {
  try {
    const restaurants = await Restaurant.find();

    const restaurantsWithUrls = restaurants.map(restaurant => {
      const imagesWithUrls = restaurant.images.map(imageKey => getPreSignedUrl(imageKey));
      return {
        ...restaurant._doc,
        images: imagesWithUrls
      };
    });

    res.status(200).json(restaurantsWithUrls);
  } catch (error) {
    console.error("Error fetching restaurants:", error);
    res.status(500).json({ message: "Error fetching restaurants" });
  }
};

export const getRestById = async(req,res)=>{
  try{
    const restaurant = await Restaurant.findById(req.params.id);
    if(!restaurant){
      return res.status(404).json({ message: 'Restaurant not found' });
    }
    const restaurantWithUrls = restaurant.images.map(imageKey=>getPreSignedUrl(imageKey));
     
    const alldata= {...restaurant._doc,images:restaurantWithUrls};
    
    res.json(alldata);
  }catch (error) {
    console.error("Error fetching restaurant by ID:", error);
    res.status(500).json({ message: 'Server error' });
  }
}


