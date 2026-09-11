import multer from "multer";
import path from "path";
import fs from "fs";
import { Request } from "express";

const UPLOAD_DIR = path.join(__dirname, "..", "..", "uploads", "farmer-docs");
fs.mkdirSync(UPLOAD_DIR, { recursive: true });

const ALLOWED_MIME_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "application/pdf"]);

/**
 * Local-disk storage for NID card / land document scans, served back via
 * `express.static("/uploads", ...)` in app.ts.
 *
 * NOTE: local disk is fine for development, but most production hosts
 * (Render, Railway, Heroku-style dynos, etc.) have ephemeral filesystems
 * — swap this for Cloudinary/S3 before shipping (env vars are already
 * scaffolded in .env.example: CLOUDINARY_*).
 */
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, UPLOAD_DIR),
  filename: (req: Request, file, cb) => {
    const userId = req.user?._id?.toString() ?? "anonymous";
    const ext = path.extname(file.originalname);
    const unique = `${userId}-${file.fieldname}-${Date.now()}${ext}`;
    cb(null, unique);
  },
});

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

/**
 * Expects multipart/form-data with up to one file in each of these fields:
 * `nidImage`, `landDocument`. Both are optional per-request (e.g. a
 * resubmission might only replace one of the two), required-on-first-
 * submit is enforced in the controller, not here.
 */
export const uploadFarmerDocs = upload.fields([
  { name: "nidImage", maxCount: 1 },
  { name: "landDocument", maxCount: 1 },
]);

/** Builds the public URL for a file saved by the storage above. */
export function toPublicUploadUrl(filename: string): string {
  return `/uploads/farmer-docs/${filename}`;
}
