import multer from "multer";
import { v2 as cloudinary, UploadApiResponse } from "cloudinary";
import { Request } from "express";

const ALLOWED_MIME_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "application/pdf"]);

/**
 * Multer keeps the file in memory until the controller uploads it to
 * Cloudinary. This avoids writing documents to an ephemeral local disk.
 */
const storage = multer.memoryStorage();

function fileFilter(_req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) {
  if (!ALLOWED_MIME_TYPES.has(file.mimetype)) {
    cb(new Error("Only JPEG, PNG, WEBP images or PDF files are allowed"));
    return;
  }
  cb(null, true);
}

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB per file
});

function configureCloudinary(): void {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) {
    throw new Error("Cloudinary upload is not configured. Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET.");
  }

  cloudinary.config({ cloud_name: cloudName, api_key: apiKey, api_secret: apiSecret, secure: true });
}

/** Uploads a validated multer file and returns its stable HTTPS URL. */
export function uploadToCloudinary(file: Express.Multer.File, userId: string): Promise<UploadApiResponse> {
  configureCloudinary();

  return new Promise((resolve, reject) => {
    const publicId = `${userId}-${file.fieldname}-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "bdagro/farmer-docs",
        public_id: publicId,
        resource_type: "auto",
      },
      (error, result) => {
        if (error) {
          reject(error);
          return;
        }
        if (!result) {
          reject(new Error("Cloudinary did not return an upload result"));
          return;
        }
        resolve(result);
      }
    );

    stream.end(file.buffer);
  });
}

/**
 * Expects multipart/form-data with up to one file in each of these fields:
 * `nidFront`, `nidBack`. Both are optional per-request (e.g. a
 * resubmission might only replace one of the two), required-on-first-
 * submit is enforced in the controller, not here.
 */
export const uploadFarmerDocs = upload.fields([
  { name: "nidFront", maxCount: 1 },
  { name: "nidBack", maxCount: 1 },
]);

/**
 * Expects multipart/form-data for loan application supporting documents:
 * `landDeed`, `incomeProof`. Both are optional but recommended. These
 * documents are uploaded to Cloudinary by the consuming controller.
 */
export const uploadLoanDocs = upload.fields([
  { name: "landDeed", maxCount: 1 },
  { name: "incomeProof", maxCount: 1 },
  { name: "farmImage", maxCount: 1 },
]);

/**
 * Expects multipart/form-data for user registration with optional avatar upload.
 */
export const uploadAvatar = upload.fields([
  { name: "avatar", maxCount: 1 },
]);
