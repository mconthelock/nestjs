import { existsSync, mkdirSync, renameSync } from 'fs';
import { join } from 'path';

/**
 * Moves a file from source to destination.
 * @param sourcePath - The path of the file to be moved.
 * @param destinationPath - The directory where the file should be moved.
 * @param fileName - The name of the file after moving.
 * @example
 * moveFile('/path/to/source/file.txt', '/path/to/destination', 'newFileName.txt');
 */
export function moveFile(sourcePath: string, destinationPath: string, fileName: string): void {
  // 1. Check if destination directory exists, if not create it
  if (!existsSync(destinationPath)) {
    mkdirSync(destinationPath, { recursive: true });
  }

  // 2. Move/rename the file
  const newFilePath = join(destinationPath, fileName);
  renameSync(sourcePath, newFilePath);
}