pipeline {
    agent any

    environment {
        ENV = 'development'
        TARGET_DIR = '/var/amecweb/wwwroot/development/api'
        GIT_SSL_NO_VERIFY = 'true'
    }

    tools {
        nodejs 'node'
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scmGit(
                    branches: [[name: '*/main']],
                    userRemoteConfigs: [[
                        url: 'https://webhub.mitsubishielevatorasia.co.th/wsd/api.git',
                        credentialsId: 'gitlab-auth-id']
                    ]
                )
            }
        }

        stage('Install & Build on NAS') {
            steps {
                sh '''
                    echo "Current directory: $(pwd)"
                    npm install
                    npm run build
                '''
            }
        }

        stage('Deploy to NAS') {
            steps {
                sh '''
                    mkdir -p ${TARGET_DIR}
                    rsync -rlptvz --delete --no-perms --no-owner --no-group \
                    dist/ ${TARGET_DIR}/
                '''
            }
        }
    }
}