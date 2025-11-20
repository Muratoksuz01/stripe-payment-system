import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { storage } from "./firebase";
import axios from "axios";
const UPLOAD_PRESET = import.meta.env.VITE_UPLOAD_PRESET
const CLOUD_NAME = import.meta.env.VITE_CLOUD_NAME
export async function uploadImage(file: File | undefined,): Promise<string> {
    if (file != undefined) {

        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", UPLOAD_PRESET);

        try {
            const res = await axios.post(
                `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
                formData,
                {
                    headers: { "Content-Type": "multipart/form-data" },
                }
            );

            return res.data.secure_url;
        } catch (error: any) {
            console.error("Cloudinary upload failed:", error.response?.data || error.message);
            throw new Error("Image upload failed");
        }
    }
    else return ""
}

