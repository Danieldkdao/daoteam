import { envServer } from "@/data/env/server";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: envServer.CLOUDINARY_CLOUD_NAME,
  api_key: envServer.CLOUDINARY_API_KEY,
  api_secret: envServer.CLOUDINARY_API_SECRET,
});

export { cloudinary };
