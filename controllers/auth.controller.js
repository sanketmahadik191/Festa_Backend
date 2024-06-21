import bcrypt from 'bcrypt';
import User from "../models/user.model.js";
import { errHandler } from '../utils/error.js';
import jwt from 'jsonwebtoken';
import 'dotenv/config'



export const signup = async (req, res,next) => {
  try {
    const { username, email, password } = req.body;
    
    if(!username || !email || !password){
      return res.status(401).json({ message: "all feilds are mandatory" });
    }

    const existingUser = await User.findOne({email});
    if(existingUser){
      return next(errHandler(401,"user alredy their"))
    }

    const existingUsername = await User.findOne({username});
    if(existingUsername){
      return next(errHandler(401,"user alredy their"))
    }

    const hasedPass = bcrypt.hashSync(password,10);
  
    const newUser =new User({ username, email, password:hasedPass});

    await newUser.save();

    const token = jwt.sign({id:newUser._id}, process.env.JWT_SECRET_KEY ,{ expiresIn: '10h' });

    const { password:pass , ...rest}= newUser._doc;
   
    res.status(200).json({ token, user: rest });
  } catch (error) {
     next(error); 
  }
};

export const signin = async(req,res,next)=>{
  try {
    const { email, password } = req.body;
    if( !email || !password){
      return next(errHandler(404,"Email and password are required"))
    }

    const validUser =await User.findOne({email});
    if(!validUser){
     return next(errHandler(404,"User not registered"));
    }
     
    const validPassword = bcrypt.compareSync(password,validUser.password);

    if(!validPassword){
       return next(errHandler(404,"Password not match"));
    }
    
    const token = jwt.sign({id:validUser._id}, process.env.JWT_SECRET_KEY ,{ expiresIn: '1h' });

    const { password:pass , ...rest}= validUser._doc;
   
    res.status(200).json({ token, user: rest });
  }
  catch(error){
       next(error); 
  }
};

export const google = async( req,res,next)=>{
  try{
   const user = await User.findOne({email: req.body.email});
   if(user){
    const token = jwt.sign({id:user._id}, process.env.JWT_SECRET_KEY );

    const { password , ...rest}= user._doc;

    res
    .cookie('access_token',token ,{httpOnly: true})
    .status(200)
    .json(rest);
   }
   else{
    const genPass = Math.random().toString(36).slice(-8);
    const hasedPass = bcrypt.hashSync(genPass,10);

    const newUser = new User({
      username:req.body.name.split(" ").join("").toLowerCase(),
      email:req.body.email,
      password:hasedPass,
      avatar: req.body.photo,
    })
   
    await newUser.save();

    const token = jwt.sign({id:newUser._id}, process.env.JWT_SECRET_KEY ,{ expiresIn: '1h' });

    const { password, ...rest}= newUser._doc;
    
    res
    .cookie('access_token',token ,{httpOnly: true})
    .status(200)
    .json(rest);
   }
   }catch(error){
    next(error);
  }
};
