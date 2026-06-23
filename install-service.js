const Service = require('node-windows').Service;
const path = require('path');

// สมมติว่าอยากรัน 4 Core
const instances = 4;
const startingPort = 3010;

for (let i = 1; i <= instances; i++) {
    const currentPort = startingPort + i; // จะได้ Port 3001, 3002, 3003, 3004

    const svc = new Service({
        name: `My App Worker ${i}`, // จะได้ Service 4 ตัวใน Windows
        description: `Node App Worker รันบน Port ${currentPort}`,
        script: path.join(__dirname, 'dist', 'main.js'),
        env: [
            {
                name: 'PORT',
                value: currentPort.toString(), // โยน Port เข้าไปทาง Environment Variable
            },
        ],
    });

    svc.on('install', function () {
        svc.start();
    });

    svc.install();
}
