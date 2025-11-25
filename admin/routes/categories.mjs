import { Router } from "express";
import { categories, products } from "../constants/index.mjs";
import {createResponse} from "../lib/responseModel.mjs";
const router = Router();

router.get("/categories", (req, res) => {
  res.send(categories);
});

router.get("/categories/:id", (req, res) => {
  const id = req.params.id;
  try {
    const matchedProducts = products?.filter((item) => item?._base === id);
    if (!matchedProducts || matchedProducts.length === 0) {
      return res
        .status(200)
        .json(createResponse(true,null,null,"No products matched with this category"));
    }
    res.json(createResponse(true,matchedProducts,null,null));
    
  } catch (error) {
    
  }
});

export default router;
