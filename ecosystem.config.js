require('dotenv').config();

module.exports = {
  apps: [
    {
      name: process.env.PM2_APP_NAME || 'SpoliveRenewal',
      // exec_mode: 'cluster',
      // instances: process.env.PM2_INSTANCES || 2,
      // max_memory_restart: process.env.MAX_MEMORY_RESTART || '256M',
      script: 'npm',
      args: 'run start',
      watch: true,
      wait_ready: true,
      listen_timeout: 50000,
      kill_timeout: 5000,
      autorestart: true,
      restart_delay: 5000,
      env: {
        NODE_ENV: 'development',
      },
      env_production: {
        NODE_ENV: 'production',
      },
      output: './logs/output.log',
      error: './logs/err.log',
    },
  ],
  deploy: {
    development: {
      key: process.env.DEPLOY_SSH_KEY_PATH || null,
      user: process.env.DEPLOY_DEV_USER,
      host: process.env.DEPLOY_DEV_HOST
        ? process.env.DEPLOY_DEV_HOST.split(',')
        : '',
      ssh_options: 'ForwardAgent=yes',
      repo: process.env.DEPLOY_DEV_REPO,
      ref: process.env.DEPLOY_DEV_REPO_BRANCH,
      path: process.env.DEPLOY_DEV_PATH,
      'post-deploy':
        'npm install && npm run build && pm2 restart ecosystem.config.js',
    },
    production: {
      key: process.env.DEPLOY_SSH_KEY_PATH || null,
      host: process.env.DEPLOY_PRODUCT_HOST
        ? process.env.DEPLOY_PRODUCT_HOST.split(',')
        : '',
      user: process.env.DEPLOY_PRODUCT_USER,
      ssh_options: 'ForwardAgent=yes',
      repo: process.env.DEPLOY_PRODUCT_REPO,
      ref: process.env.DEPLOY_PRODUCT_REPO_BRANCH,
      path: process.env.DEPLOY_PRODUCT_PATH,
      'post-deploy':
        'git pull && npm install && npm run build && pm2 restart ecosystem.config.js --env production',
    },
  },
};

// setup ; pm2 delopy ecosystem.config.js setup
// update ; pm2 deploy ecosystem.config.js update
