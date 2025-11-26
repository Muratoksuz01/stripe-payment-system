import { Router } from "express";
import { blogsData } from "../constants/index.mjs";

const router = Router();

router.get("/blogs", async (req, res) => {
  try {
    res.json(blogsData);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});


export default router;
