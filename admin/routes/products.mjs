import { Router } from "express";
import { products } from "../constants/index.mjs";

const router = Router();

router.get("/products", (req, res) => {
 const page = parseInt(req.query.page) || 1;      // ?page=1
  const limit = parseInt(req.query.limit) || 20;   // ?limit=20
  const start = (page - 1) * limit;
  const end = start + limit;

  const paginated = products.slice(start, end);

  res.status(200).json({
    page,
    limit,
    total: products.length,
    totalPages: Math.ceil(products.length / limit),
    data: paginated,
  });
});
router.get("/product/search",(req,res) => {
  const q=req.query.q?.toString().toLowerCase() || ""
  const filteredProducts=products.filter(item=>
    item.name.toLowerCase().includes(q) ||
    item.description.toLowerCase().includes(q) ||
    item.category.toLowerCase().includes(q)     
  )
  res.status(200).json({
    total:filteredProducts.length,
    data:filteredProducts
  })
})
router.get("/products/:id", (req, res) => {
  const productId = parseInt(req.params.id);
  const product = products.find((item) => item._id === productId);

  if (!productId) {
    return res.status(404).json({ message: "Single Phone was not found" });
  }
  res.send(product);
});

export default router;
