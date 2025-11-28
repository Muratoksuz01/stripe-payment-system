import { Router } from "express";
import db from "../config/firebase.mjs";
import multer from "multer";
import jwt from "jsonwebtoken";
import { createResponse } from "../lib/responseModel.mjs"
import { uploadImage } from "../lib/uploadImage.mjs"
const upload = multer({ storage: multer.memoryStorage() });
const JWT_SECRET = process.env.JWT_SECRET || "superSecretKey"; // .env'ye koy
const router = Router();


router.post("/api/register", upload.single("avatar"), async (req, res) => {
    try {
        const { firstName, lastName, email, password } = req.body;

        if (!firstName || !lastName || !email || !password) {
            return res
                .json(createResponse(false, null, "", "Eksik alanlar var"));
        }

        // email kontrol
        const usersRef = db.collection("users");
        const snap = await usersRef.where("email", "==", email).get();

        if (!snap.empty) {
            return res
                .json(createResponse(false, null, "", "Bu email zaten kayıtlı"));
        }

      

        // yeni kullanıcı
        const newUser = {
            firstName,
            lastName,
            email,
            password,        // ileride hash eklersin
            avatar: "",
        };

        const docRef = await usersRef.add(newUser);

        // token üretimi
        const token = jwt.sign(
            { id: docRef.id },
            JWT_SECRET,
            { expiresIn: "7d" }
        );

        return res.json(
            createResponse(
                true,
                {
                    token,
                    id: docRef.id,
                    ...newUser,
                },
                "Kayıt başarılı"
            )
        );

    } catch (err) {
        return res
            .status(500)
            .json(createResponse(false, null, err.message || "Server error"));
    }
});

router.post("/api/login", async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password)
        return res.status(400).json({ message: "Email and password required" });
    try {
        const usersRef = db.collection("users");
        const snapshot = await usersRef.where("email", "==", email).get();
        if (snapshot.empty) {
            return res.status(404).json({ message: "User not found" });
        }
        const userDoc = snapshot.docs[0];
        const userData = userDoc.data();
        if (userData.password !== password) {
            return res.status(401).json({ message: "Incorrect password" });
        }
        const token = jwt.sign(
            {
                id: userDoc.id,
            },
            JWT_SECRET,
            { expiresIn: "7d" } // 7 gün
        );

        return res.json(createResponse(
            true,
            {
                id: userDoc.id,
                firstName: userData.firstname,
                lastName: userData.lastName,
                email: userData.email,
                password: userData.password,        // ileride hash eklersin
                avatar: userData.avatarUrl,
                token,
            },
            "Login successful"));
    } catch (err) {
        console.error("Login error:", err);
        return res.status(500).json({ message: "Server error" });
    }
});

router.post("/api/getUser", async (req, res) => {
  const { token } = req.body;

  if (!token) {
    return res.json(createResponse(false, null, "", "Token gönderilmedi"));
  }

  try {
    // Token doğrulama
    const decoded = jwt.verify(token, JWT_SECRET);
    const userId = decoded.id; // login sırasında token payload'a id koyduysan

    if (!userId) {
      return res.json(createResponse(false, null, "", "Token geçersiz"));
    }

    // Firebase'den kullanıcı çek
    const userRef = db.collection("users").doc(userId);
    const userSnap = await userRef.get();

    if (!userSnap.exists) {
      return res.json(createResponse(false, null, "", "Kullanıcı bulunamadı"));
    }

    const userData = userSnap.data();
    return res.json(createResponse(true, userData, "", ""));
  } catch (error) {
    console.error("getUser error:", error);
    return res.json(createResponse(false, null, "", "Token doğrulama hatası"));
  }
});
router.post("/api/editUyelikBilgileri", async (req, res) => {
  const { id, firstName, lastName, email } = req.body;

  if (!id) return res.json(createResponse(false, "User ID eksik"));

  try {
    const userRef = db.collection("users").doc(id);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      return res.json(createResponse(false, "Kullanıcı bulunamadı"));
    }

    await userRef.update({ firstName, lastName, email });
    res.json(createResponse(true, "Kullanıcı bilgileri güncellendi"));
  } catch (err) {
    console.error(err);
    res.json(createResponse(false, "Güncelleme sırasında hata oluştu"));
  }
});

// Şifre güncelleme
router.post("/api/editPassword", async (req, res) => {
  const { id, oldPass, newPass } = req.body;

  if (!id) return res.json(createResponse(false, "User ID eksik"));
  if (!oldPass || !newPass) return res.json(createResponse(false, "Eski veya yeni şifre eksik"));

  try {
    const userRef = db.collection("users").doc(id);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      return res.json(createResponse(false, "Kullanıcı bulunamadı"));
    }

    const userData = userDoc.data();

    if (userData.password !== oldPass) {
      return res.json(createResponse(false, "Eski şifre yanlış"));
    }

    await userRef.update({ password: newPass });
    res.json(createResponse(true, "Şifre güncellendi"));
  } catch (err) {
    console.error(err);
    res.json(createResponse(false, "Şifre güncelleme sırasında hata oluştu"));
  }
});
export default router;
