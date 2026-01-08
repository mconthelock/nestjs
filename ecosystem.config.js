module.exports = {
  apps: [
    {
      name: 'api',
      script: './dist/main.js',
      exec_mode: 'cluster',
      instances: '2',
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      error_file: './logs/pm2-err.log',
      out_file: './logs/pm2-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss',
    },
  ],
};
