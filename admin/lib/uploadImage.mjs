// uploadImage.mjs
import axios from "axios";
import FormData from "form-data"; // <-- Bu çok önemli! Native FormData değil
import fs from "fs";

const UPLOAD_PRESET = process.env.VITE_UPLOAD_PRESET;
const CLOUD_NAME = process.env.VITE_CLOUD_NAME;

export async function uploadImage(file) {
    if (!file) return "";

    // Multer'dan gelen req.file zaten buffer içeriyor
    const formData = new FormData();
    
    // Buffer'ı doğru şekilde ekle
    formData.append("file", file.buffer, {
        filename: file.originalname || `avatar-${Date.now()}.jpg`,
        contentType: file.mimetype || "image/jpeg",
    });

    formData.append("upload_preset", UPLOAD_PRESET);

    try {
        const res = await axios.post(
            `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
            formData,
            {
                headers: {
                    ...formData.getHeaders(), // Bu satır kritik!
                },
            }
        );

        return res.data.secure_url;
    } catch (error) {
        console.error("Cloudinary upload failed:", error.response?.data || error.message);
        throw new Error("Image upload failed");
    }
}