import Shop from "../models/shop.model.js";
import uploadOnCloudinary from "../utils/cloudinary.js";

export const createEditShop=async (req,res) => {
    try {
       let {name,city,state,address}=req.body;
       city = city?.trim().toLowerCase(); // enforce lowercase
       let image;
       if(req.file){
        image=await uploadOnCloudinary(req.file.path)
       }
       let shop=await Shop.findOne({owner:req.userId})
       if(!shop){
        shop=await Shop.create({
        name,city,state,address,image,owner:req.userId
       })
       }else{
         shop=await Shop.findByIdAndUpdate(shop._id,{
        name,city,state,address,image,owner:req.userId
       },{new:true})
       }
       await shop.populate("owner items")
       
       // Clear cache for this city
       const { clearCachePattern } = await import("../config/redis.config.js");
       if (shop.city) {
           await clearCachePattern(`shops:${shop.city.toLowerCase()}`);
       }

       return res.status(201).json(shop)
    } catch (error) {
        return res.status(500).json({message:`create shop error ${error}`})
    }
}

export const getMyShop=async (req,res) => {
    try {
        const shop=await Shop.findOne({owner:req.userId}).populate("owner").populate({
            path:"items",
            options:{sort:{updatedAt:-1}}
        })
        if(!shop){
            return res.status(404).json({ message: "shop not found" });
        }
        return res.status(200).json(shop)
    } catch (error) {
        return res.status(500).json({message:`get my shop error ${error}`})
    }
}

export const getShopByCity=async (req,res) => {
    try {
        let { city } = req.params;
        console.log("[BACKEND] Requested city (raw):", city);
        
        city = city.trim().toLowerCase();
        console.log("[BACKEND] Normalized city:", city);
        
        // Check cache first
        const { getCache, setCache } = await import("../config/redis.config.js");
        const cacheKey = `shops:${city}`;
        const cachedShops = await getCache(cacheKey);
        
        console.log('[DEBUG] Cache check:', { 
            cacheKey, 
            isCached: !!cachedShops, 
            dataType: typeof cachedShops,
            isArray: Array.isArray(cachedShops),
            length: cachedShops?.length
        });
        
        if (cachedShops) {
            console.log(`⚡ Cache hit for city: ${city}`);
            return res.status(200).json(cachedShops);
        }
        
        console.log("💾 Cache miss - querying database");
        const allShops = await Shop.find({});
        console.log("[BACKEND] All shops in DB:", allShops.map(s => ({ name: s.name, city: s.city })));
        
        const shops = await Shop.find({ city: city }).populate('items');
        console.log("[BACKEND] Shops found for city '" + city + "':", shops.length);
        
        if(!shops || shops.length === 0){
            return res.status(200).json([]);
        }

        // Set cache (5 mins TTL)
        await setCache(cacheKey, shops, 300);
        console.log(`💾 Cache set for city: ${city}`);

        return res.status(200).json(shops);
    } catch (error) {
        console.log("[BACKEND] Error:", error);
        return res.status(500).json({message:`get shop by city error ${error}`})
    }
}