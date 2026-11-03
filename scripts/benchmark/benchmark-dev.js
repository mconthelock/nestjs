/**
 * Real `npm run start:dev` Benchmark Utility
 * -------------------------------------------
 * รันเพื่อวัดเวลาการบูตเครื่องในโหมด Development (nest start --swc) จริงๆ
 * เพื่อดูว่าเครื่องของแต่ละคนในทีม ใช้เวลาไปกับขั้นตอนใดบ้าง
 *
 * วิธีใช้:
 *   npm run benchmark:dev
 */

const { spawn } = require('child_process');
const { performance } = require('perf_hooks');
const os = require('os');
const path = require('path');
const fs = require('fs');
const net = require('net');

console.log('================================================================');
console.log('⚡ BENCHMARK: REAL `npm run start:dev` (NEST CLI + SWC RUNTIME)');
console.log('================================================================\n');

// ค้นหาพอร์ตว่างแบบไดนามิก ป้องกันปัญหา EADDRINUSE 100%
function getFreePort() {
    return new Promise((resolve, reject) => {
        const server = net.createServer();
        server.unref();
        server.on('error', reject);
        server.listen(0, () => {
            const port = server.address().port;
            server.close(() => resolve(port));
        });
    });
}

async function start() {
    const freeMemGB = (os.freemem() / 1024 / 1024 / 1024).toFixed(2);
    const totalMemGB = (os.totalmem() / 1024 / 1024 / 1024).toFixed(2);

    // 1. ข้อมูลสเปกเครื่อง (Machine Specs)
    console.log('💻 ข้อมูลเครื่องปัจจุบัน (Machine Hardware Info):');
    console.log(`   - Hostname     : ${os.hostname()}`);
    console.log(`   - Platform     : ${os.platform()} (${os.arch()}) ${os.release()}`);
    console.log(`   - CPU Model    : ${os.cpus()[0]?.model || 'Unknown'}`);
    console.log(`   - CPU Cores    : ${os.cpus().length} Cores`);
    console.log(`   - Total Memory : ${totalMemGB} GB (Free: ${freeMemGB} GB)`);
    console.log(`   - Node.js      : ${process.version}`);

    if (+freeMemGB < 1.5) {
        console.log('   ⚠️ คำเตือน: หน่วยความจำ Free RAM เหลือน้อยกว่า 1.5 GB');
        console.log('      (Windows อาจเกิด Memory Swapping ทำให้ SWC Compiler ทำงานช้าลงชั่วคราว)');
    }
    console.log('----------------------------------------------------------------\n');

    const testPort = await getFreePort();
    console.log(`🚀 กำลังเริ่มรัน \`nest start --swc\` (สุ่มพอร์ตว่างอัตโนมัติ: ${testPort})...`);
    console.log('⏳ กำลังจับเวลาแต่ละ Phase แบบ Real-time...\n');

    const t0 = performance.now();
    let t_cli_spawned = null;
    let t_code_loaded = null;
    let t_db_connected = null;
    let t_app_ready = null;

    // แสดง Heartbeat ทุก 5 วินาทีขณะที่กำลังคอมไพล์
    const heartbeat = setInterval(() => {
        if (!t_cli_spawned) {
            const elapsed = ((performance.now() - t0) / 1000).toFixed(0);
            process.stdout.write(`   ⏳ [${elapsed}s] กำลังประมวลผล SWC Compiler & File Watcher (2,903 ไฟล์)...\r`);
        }
    }, 5000);

    const nestBin = path.resolve(process.cwd(), 'node_modules/@nestjs/cli/bin/nest.js');
    let child;

    if (fs.existsSync(nestBin)) {
        // รันตรงผ่าน node binary เพื่อตัด npx overhead และป้องกัน DeprecationWarning [DEP0190]
        child = spawn(process.execPath, [nestBin, 'start', '--swc'], {
            cwd: process.cwd(),
            env: {
                ...process.env,
                PORT: String(testPort),
            },
            shell: false,
        });
    } else {
        const isWin = process.platform === 'win32';
        child = spawn('cmd.exe', ['/c', 'npx nest start --swc'], {
            cwd: process.cwd(),
            env: {
                ...process.env,
                PORT: String(testPort),
            },
            shell: false,
        });
    }

    let isFinished = false;

    function killProcessTree() {
        if (!child || !child.pid) return;
        if (process.platform === 'win32') {
            try {
                spawn('taskkill', ['/pid', String(child.pid), '/f', '/t']);
            } catch (_) {
                child.kill('SIGKILL');
            }
        } else {
            child.kill('SIGKILL');
        }
    }

    child.stdout.on('data', (data) => {
        const text = data.toString();
        const now = performance.now();
        const elapsedSec = ((now - t0) / 1000).toFixed(2);

        // Milestone 1: SWC compile จบ และ Node Runtime เริ่มรัน main.ts
        if (!t_cli_spawned && (text.includes('Winston log directory') || text.includes('Oracle Instant Client') || text.includes('injected env'))) {
            t_cli_spawned = now;
            clearInterval(heartbeat);
            process.stdout.write('\r                                                                                \r');
            console.log(`  ⏱️  [${elapsedSec}s] จบขั้นตอน SWC Compiler (Rust Transpilation) -> เริ่มโหลด Node Modules`);
        }

        // Milestone 2: NestJS ทำ DI Resolution เสร็จ และเริ่มต่อ Redis / DB
        if (!t_code_loaded && (text.includes('connected') || text.includes('TypeOrmModule') || text.includes('Redis') || text.includes('Connected to IBM AS400'))) {
            t_code_loaded = now;
            console.log(`  ⏱️  [${elapsedSec}s] โหลด Modules และ Resolve DI เสร็จสิ้น -> เริ่มต่อ Database & Redis`);
        }

        // Milestone 3: Database & External connections สำเร็จ
        if (!t_db_connected && (text.includes('Connected to IBM AS400') || text.includes('Redis adapter attached') || text.includes('SocketIoAdapter'))) {
            t_db_connected = now;
            console.log(`  ⏱️  [${elapsedSec}s] เชื่อมต่อ Database ทุกตัว + Redis + Socket.io สำเร็จ`);
        }

        // Milestone 4: Application พร้อมรับ Request อย่างเป็นทางการ
        if (text.includes('Application is running on')) {
            t_app_ready = now;
            clearInterval(heartbeat);
            console.log(`  🎉 [${elapsedSec}s] เซิร์ฟเวอร์พร้อมทำงานเต็มรูปแบบ! (Ready)\n`);
            finishBenchmark();
        }
    });

    child.stderr.on('data', (data) => {
        const errText = data.toString();
        if (errText.includes('EADDRINUSE') || errText.includes('Error: listen') || errText.includes('Cannot find module')) {
            clearInterval(heartbeat);
            console.error('\n❌ เกิดข้อผิดพลาดระหว่างรันเซิร์ฟเวอร์:', errText.trim());
            killProcessTree();
            process.exit(1);
        }
    });

    child.on('error', (err) => {
        clearInterval(heartbeat);
        console.error('Child Process Error:', err);
        killProcessTree();
        process.exit(1);
    });

    function finishBenchmark() {
        if (isFinished) return;
        isFinished = true;
        clearInterval(heartbeat);
        killProcessTree();

        const totalMs = t_app_ready - t0;
        const p1 = (t_cli_spawned || t0) - t0;
        const p2 = (t_code_loaded || t_cli_spawned || t0) - (t_cli_spawned || t0);
        const p3 = (t_db_connected || t_code_loaded || t0) - (t_code_loaded || t_cli_spawned || t0);
        const p4 = t_app_ready - (t_db_connected || t_code_loaded || t0);

        const reportTable = [
            {
                'Startup Phase': '1. SWC Compiler (Rust Transpilation & Watcher)',
                'Time (sec)': +(p1 / 1000).toFixed(2),
                '% Ratio': +((p1 / totalMs) * 100).toFixed(1) + '%',
                'คำอธิบาย': 'ความเร็ว CPU และ Disk I/O ในการแปลงไฟล์ TypeScript 2,900+ ไฟล์',
            },
            {
                'Startup Phase': '2. Code Modules Import & DI Resolution',
                'Time (sec)': +(p2 / 1000).toFixed(2),
                '% Ratio': +((p2 / totalMs) * 100).toFixed(1) + '%',
                'คำอธิบาย': 'Node.js อ่าน 427 Modules และเชื่อม Dependency Injection',
            },
            {
                'Startup Phase': '3. TypeORM Metadata & 8 Database Pools',
                'Time (sec)': +(p3 / 1000).toFixed(2),
                '% Ratio': +((p3 / totalMs) * 100).toFixed(1) + '%',
                'คำอธิบาย': 'เวลาสร้าง Connection Pool และ Map Entity 535 ตัวกับ Database',
            },
            {
                'Startup Phase': '4. HTTP Listen & Middleware Ready',
                'Time (sec)': +(p4 / 1000).toFixed(2),
                '% Ratio': +((p4 / totalMs) * 100).toFixed(1) + '%',
                'คำอธิบาย': 'เปิด Port และผูก Middlewares/Interceptors พร้อมรับ Request',
            },
        ];

        console.log('================================================================');
        console.log(`📊 สรุปเวลา start:dev บนเครื่องนี้: ${(totalMs / 1000).toFixed(2)} วินาที`);
        console.log('================================================================');
        console.table(reportTable);

        console.log('💡 ข้อแนะนำและการวิเคราะห์ประสิทธิภาพ:');
        if (p1 > 20000) {
            console.log('   ⚠️ Phase 1 ใช้เวลาเกิน 20 วินาที: เกิดจาก Windows Defender / Antivirus กำลังดัก Scan ไฟล์ 2,900+ ไฟล์ หรือ RAM ว่างน้อย');
            console.log('      👉 แนะนำให้เพิ่มโฟลเดอร์โปรเจกต์นี้เข้าไปใน Exclusion List ของ Windows Defender / Antivirus');
        }
        console.log('   - Phase 1 (SWC): ขึ้นกับ CPU Single-core Clock, ความเร็ว SSD และ Windows Defender/Antivirus');
        console.log('   - Phase 2 (Modules): ขึ้นกับความเร็ว RAM และจำนวน Modules ในระบบ');
        console.log('   - Phase 3 (Database): ขึ้นกับ Network Ping ไปยัง Database Server (Oracle/MSSQL)');
        console.log('\nเสร็จสิ้น.');
        process.exit(0);
    }

    // Timeout 180 วินาที
    setTimeout(() => {
        if (!isFinished) {
            clearInterval(heartbeat);
            console.error('\n⚠️ Benchmark Timeout เกิน 180 วินาที');
            killProcessTree();
            process.exit(1);
        }
    }, 180000);
}

start();
