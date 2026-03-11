import * as fs from 'fs';
import * as path from 'path';
import { Options as MulterOptions, StorageEngine } from 'multer';
import sharp = require('sharp');

const MAX_IMAGE_SIZE_BYTES = 1024 * 1024;
const MAX_UPLOAD_SIZE_BYTES = 1024 * 1024 * 20;
const RESIZABLE_MIME_TYPES = new Set([
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
    'image/avif',
    'image/tiff',
]);

const getFileExtension = (file: Express.Multer.File) => {
    const ext = path.extname(file.originalname);
    if (ext) return ext;

    // fallback ถ้า originalname ไม่มีนามสกุล
    switch (file.mimetype) {
        case 'image/jpeg':
            return '.jpg';
        case 'image/png':
            return '.png';
        case 'image/gif':
            return '.gif';
        case 'image/webp':
            return '.webp';
        case 'image/avif':
            return '.avif';
        case 'image/tiff':
            return '.tiff';
        default:
            return '';
    }
};

const ensureUploadPath = (destination: string) => {
    const uploadPath = path.join(destination);
    if (!fs.existsSync(uploadPath)) {
        fs.mkdirSync(uploadPath, { recursive: true });
    }

    return uploadPath;
};

const applySharpOutput = (
    transformer: sharp.Sharp,
    mimetype: string,
    quality: number,
) => {
    switch (mimetype) {
        case 'image/png':
            return transformer.png({
                quality,
                compressionLevel: 9,
                palette: true,
                effort: 10,
            });
        case 'image/gif':
            return transformer.gif({
                effort: 10,
                reuse: true,
                colours: 256,
            });
        case 'image/webp':
            return transformer.webp({ quality, effort: 6 });
        case 'image/avif':
            return transformer.avif({ quality, effort: 8 });
        case 'image/tiff':
            return transformer.tiff({ quality, compression: 'jpeg' });
        case 'image/jpeg':
        default:
            return transformer.jpeg({ quality, mozjpeg: true });
    }
};

const compressImageToTargetSize = async (buffer: Buffer, mimetype: string) => {
    if (buffer.length <= MAX_IMAGE_SIZE_BYTES) {
        return buffer;
    }

    if (!RESIZABLE_MIME_TYPES.has(mimetype)) {
        return buffer;
    }

    const metadata = await sharp(buffer).metadata();
    let width = metadata.width;
    let height = metadata.height;
    let quality = mimetype === 'image/png' ? 90 : 82;
    let bestBuffer = buffer;

    for (let attempt = 0; attempt < 20; attempt++) {
        let transformer = sharp(buffer).rotate();

        if (width || height) {
            transformer = transformer.resize({
                width,
                height,
                fit: 'inside',
                withoutEnlargement: true,
            });
        }

        const candidate = await applySharpOutput(
            transformer,
            mimetype,
            quality,
        ).toBuffer();

        if (candidate.length < bestBuffer.length) {
            bestBuffer = candidate;
        }

        if (candidate.length <= MAX_IMAGE_SIZE_BYTES) {
            return candidate;
        }

        quality = Math.max(20, quality - 8);

        if (width) {
            width = Math.max(Math.round(width * 0.82), 64);
        }

        if (height) {
            height = Math.max(Math.round(height * 0.82), 64);
        }
    }

    return bestBuffer;
};

const imageStorage: StorageEngine = {
    _handleFile(req, file, cb) {
        const chunks: Buffer[] = [];

        file.stream.on('data', (chunk: Buffer) => {
            chunks.push(chunk);
        });

        file.stream.on('error', (error) => cb(error));

        file.stream.on('end', async () => {
            try {
                if (!req.body?.destination) {
                    throw new Error('Upload destination is required');
                }

                const uploadPath = ensureUploadPath(req.body.destination);
                const uniqueSuffix =
                    Date.now() + '-' + Math.round(Math.random() * 1e9);
                const ext = getFileExtension(file);
                const filename = `${uniqueSuffix}${ext}`;
                const filePath = path.join(uploadPath, filename);
                const originalBuffer = Buffer.concat(chunks);
                const outputBuffer = await compressImageToTargetSize(
                    originalBuffer,
                    file.mimetype,
                );

                await fs.promises.writeFile(filePath, outputBuffer);

                cb(null, {
                    destination: uploadPath,
                    filename,
                    path: filePath,
                    size: outputBuffer.length,
                });
            } catch (error) {
                cb(error as Error);
            }
        });
    },
    _removeFile(req, file, cb) {
        if (file.path && fs.existsSync(file.path)) {
            fs.unlink(file.path, cb);
            return;
        }

        cb(null);
    },
};

export const multerOptions: MulterOptions = {
    storage: imageStorage,
    fileFilter: (req, file, cb) => {
        const allowedMimeTypes = ['image/*'];
        const isMimeTypeAllowed = allowedMimeTypes.some((mimePattern) => {
            const regex = new RegExp(`^${mimePattern.replace('*', '.*')}$`);
            return regex.test(file.mimetype);
        });
        if (!isMimeTypeAllowed) {
            return cb(null, false);
        }
        cb(null, true);
    },
    limits: {
        fileSize: MAX_UPLOAD_SIZE_BYTES,
    },
};
