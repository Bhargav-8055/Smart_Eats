import express from "express"
import { createEditShop, getMyShop, getShopByCity } from "../controllers/shop.controllers.js"
import isAuth from "../middlewares/isAuth.js"
import { upload } from "../middlewares/multer.js"

const router=express.Router()

router.post("/create-edit-shop",isAuth,upload.single("image"),createEditShop)
router.get("/get-my-shop",isAuth,getMyShop)
router.get("/get-shop-by-city/:city",getShopByCity)

export default router