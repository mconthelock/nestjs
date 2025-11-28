import * as fs from 'fs';
import * as path from 'path';

let cachedIgnoredEndpoints: string[] = [];
let lastModified = 0;

// อ่านรายการ endpoints ที่ไม่ต้องการบันทึก log จากไฟล์
function loadIgnoredEndpoints(): string[] {
  const filePath = path.join(process.cwd(), 'ignored-endpoints.txt');

  try {
    // ตรวจสอบว่าไฟล์มีการเปลี่ยนแปลงหรือไม่
    const stats = fs.statSync(filePath);
    const currentModified = stats.mtime.getTime();

    // ถ้าไฟล์ไม่เปลี่ยนแปลง ใช้ cache
    if (currentModified === lastModified && cachedIgnoredEndpoints.length > 0) {
      return cachedIgnoredEndpoints;
    }

    // อ่านไฟล์ใหม่
    const content = fs.readFileSync(filePath, 'utf-8');
    cachedIgnoredEndpoints = content
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line && !line.startsWith('#')); // ละเว้นบรรทัดว่างและ comment

    lastModified = currentModified;
    return cachedIgnoredEndpoints;
  } catch (error) {
    console.warn(
      'Warning: Could not load ignored-endpoints.txt, using empty list',
    );
    return [];
  }
}

// ตรวจสอบว่า URL ควรถูก ignore หรือไม่
export function shouldIgnoreEndpoint(url: string): boolean {
  const ignoredEndpoints = loadIgnoredEndpoints();
  return ignoredEndpoints.some(
    (endpoint) => url === endpoint || url.startsWith(endpoint),
  );
}
