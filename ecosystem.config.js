const envMode = process.env.NODE_ENV || 'development';
const instanceCount = envMode === 'production' ? 4 : 2;
module.exports = {
    apps: [
        {
            name: 'api_test',
            script: './dist/main.js',
            exec_mode: 'cluster',
            instances: instanceCount,
            autorestart: true,
            watch: false,
            max_memory_restart: '1G',
            error_file: './logs/pm2-err.log',
            out_file: './logs/pm2-out.log',
            log_date_format: 'YYYY-MM-DD HH:mm:ss',
            wait_ready: false,
            listen_timeout: 10000,
            kill_timeout: 5000,
        },
    ],
};
