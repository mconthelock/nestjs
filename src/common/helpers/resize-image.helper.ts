import * as fs from 'fs';
import * as path from 'path';
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

const getPreserveRatioResizeOptions = (
    width?: number,
    height?: number,
): sharp.ResizeOptions | null => {
    if (!width && !height) {
        return null;
    }

    return {
        width,
        height,
        fit: 'inside',
        withoutEnlargement: true,
    };
};

export const compressSize = async (
    buffer: Buffer,
    mimetype: string,
    maxSize?: number,
) => {
    maxSize = maxSize || MAX_IMAGE_SIZE_BYTES;
    if (buffer.length <= maxSize) {
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
        const resizeOptions = getPreserveRatioResizeOptions(width, height);

        if (resizeOptions) {
            transformer = transformer.resize(resizeOptions);
        }

        const candidate = await applySharpOutput(
            transformer,
            mimetype,
            quality,
        ).toBuffer();

        if (candidate.length < bestBuffer.length) {
            bestBuffer = candidate;
        }

        if (candidate.length <= maxSize) {
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

export const compressDimension = async (
    buffer: Buffer,
    mimetype: string,
    width?: number,
    height?: number,
) => {
    if (!RESIZABLE_MIME_TYPES.has(mimetype)) {
        return buffer;
    }

    const resizeOptions = getPreserveRatioResizeOptions(width, height);
    let transformer = sharp(buffer).rotate();

    if (resizeOptions) {
        transformer = transformer.resize(resizeOptions);
    }

    return applySharpOutput(
        transformer,
        mimetype,
        mimetype === 'image/png' ? 90 : 82,
    ).toBuffer();
};
