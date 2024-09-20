import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
export const protectRoute=async(req,res,next)=>{

    try {
        const accesstoken=req.cookies.accessToken
        if(!accesstoken)
        {
            return res.status(401).json({message:"Not authorized"})
        }
       
        try{
            const decoded=jwt.verify(accesstoken,process.env.ACCESS_TOKEN_SECRET);
            const user =  await User.findById(decoded.userId).select("-password")
             if(!user)
             {
                 return res.status(401),json({message:"User ot found"})
             }
             req.user = user;
             next();
        }
        catch(error)
        {
            if(error.name === "TokenExpiredError")
            {
                return res.status(401).json({message:"Token expired"})
            }
            throw error;
        }


    } catch (error) {
        console.log("error in protect route",error.message);
        return res.status(401).json({message:"Not authorized"})
    }
}

export const adminRoute =async(req,res,next)=>{
    if(req.user && req.user.role==="admin")
    {
        next();
    }
    else{
        return res.status(403).json({message:"Access denied-Admin Only"})
    }

}