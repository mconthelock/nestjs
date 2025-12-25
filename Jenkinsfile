pipeline {
    agent any

    environment {
        ENV = 'development'
        TARGET_DIR = '/var/amecweb/wwwroot/development/api_auto'
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
                withCredentials([file(credentialsId: 'api-env-file', variable: 'MY_ENV_FILE')]) {
                    sh '''
                        cp $MY_ENV_FILE .env

                        npm install
                        npm run build

                        rm .env
                    '''
                }
            }
        }

        stage('Deploy to NAS') {
            steps {
                sh '''
                    mkdir -p ${TARGET_DIR}
                    rsync -rlptvz --delete --no-perms --no-owner --no-group \
                    dist/ ${TARGET_DIR}/dist/
                '''
            }
        }

        stage('Restart Application on NAS') {
            steps {
                sshagent(credentials: ['ssh-amecwebtest1']) {
                   sh """
                    ssh -o StrictHostKeyChecking=no Administrator@amecwebtest1 << 'EOF'
                        ls -la
                        pm2 reload api
                    EOF """
                }
            }
        }
    }
}