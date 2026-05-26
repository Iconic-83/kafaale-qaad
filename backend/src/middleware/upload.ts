import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { Request } from 'express';

// ── Storage Location ────────────────────────────────────
const UPLOAD_DIR = path.join(process.cwd(), 'uploads');

// Ensure upload directories exist
['cases', 'field', 'delivery', 'profiles'].forEach((dir) => {
  const fullPath = path.join(UPLOAD_DIR, dir);
  if (!fs.existsSync(fullPath)) {
    fs.mkdirSync(fullPath, { recursive: true });
  }
});

// ── Disk Storage ─────────────────────────────────────────
const storage = multer.diskStorage({
  destination: (req: Request, file, cb) => {
    const folder = req.path.includes('field') ? 'field'
      : req.path.includes('delivery') ? 'delivery'
      : req.path.includes('profile') ? 'profiles'
      : 'cases';
    cb(null, path.join(UPLOAD_DIR, folder));
  },
  filename: (req: Request, file, cb) => {
    const unique = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `${unique}${ext}`);
  },
});

// ── File Filter — Only safe types ────────────────────────
const fileFilter = (_req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedImages = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  const allowedVideos = ['video/mp4', 'video/quicktime', 'video/avi'];
  const allowedDocs = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  ];

  if ([...allowedImages, ...allowedVideos, ...allowedDocs].includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`File type ${file.mimetype} is not allowed`));
  }
};

// ── Limits ─────────────────────────────────────────────
const limits = {
  fileSize: 20 * 1024 * 1024, // 20MB per file
  files: 10,                   // Max 10 files per upload
};

// ── Export multer instances ─────────────────────────────
export const upload = multer({ storage, fileFilter, limits });

/** Build public URL for an uploaded file */
export function buildFileUrl(req: Request, filename: string, folder: string): string {
  const baseUrl = process.env.BASE_URL || `${req.protocol}://${req.get('host')}`;
  return `${baseUrl}/uploads/${folder}/${filename}`;
}

/** Get media type from mimetype */
export function getMediaType(mimetype: string): 'image' | 'video' | 'document' {
  if (mimetype.startsWith('image/')) return 'image';
  if (mimetype.startsWith('video/')) return 'video';
  return 'document';
}
