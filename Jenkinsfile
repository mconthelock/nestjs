pipeline {
    agent any

    parameters {
        // เผื่อไว้ในกรณีที่อยากกดเลือกเองตอนสั่ง Build แบบ Manual
        choice(name: 'DEPLOY_ENV', choices: ['development', 'production'], description: 'Select Environment to deploy')
    }

    environment {
        TARGET_DIR = ""
        ENV_CRED_ID = ""
        GIT_SSL_NO_VERIFY = 'true'
    }

    stages {
        stage('Setup Environment') {
            steps {
                script {
                    // 1. ตรวจสอบว่าเป็นการกด Build เองจากหน้าเว็บหรือไม่
                    // currentBuild.getBuildCauses() จะคืนค่า list ของสาเหตุการ Build
                    // ถ้ามี 'UserIdCause' แสดงว่ามีคนมากดปุ่ม Build ใน Jenkins
                    def isManualTrigger = currentBuild.getBuildCauses().toString().contains('UserIdCause')

                    // 2. ตรวจสอบเงื่อนไข
                    // จะไป Production ได้ต้อง: กดมือเอง (Manual) AND เลือก Parameter เป็น production
                    if (isManualTrigger && params.DEPLOY_ENV == 'production') {
                        env.TARGET_DIR = '/var/amecweb/wwwroot/production/api_test'
                        env.ENV_CRED_ID = 'api-env-prod'
                        env.NODE_ENV = 'production'
                        echo ">>> MANUAL BUILD: Deploying to PRODUCTION"
                    }
                    // กรณีอื่นๆ (เช่น GitLab Webhook ผลักมา หรือกดมือแต่เลือก development)
                    else {
                        env.TARGET_DIR = '/var/amecweb/wwwroot/development/api'
                        env.ENV_CRED_ID = 'api-env-file'
                        env.NODE_ENV = 'development'

                        if (!isManualTrigger) {
                            echo ">>> WEBHOOK DETECTED: Auto-deploying to DEVELOPMENT"
                        } else {
                            echo ">>> MANUAL BUILD: Selected DEVELOPMENT"
                        }
                    }

                    echo "Target Directory: ${env.TARGET_DIR}"
                }
            }
        }

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

        stage('Install & Build') {
            steps {
                withCredentials([file(credentialsId: "${env.ENV_CRED_ID}", variable: 'ENV_FILE')]) {
                    sh '''
                        npm install
                        npm run build

                        cp $ENV_FILE .env
                    '''
                }
            }
        }

        stage('Deploy to NAS') {
            steps {
                sh '''
                    mkdir -p ${TARGET_DIR}
                    rsync -rlptvz --delete --no-perms --no-owner --no-group dist/ ${TARGET_DIR}/dist/
                    rsync -av public/ ${TARGET_DIR}/public/
                    rsync -vpt package.json package-lock.json ecosystem.config.js ${TARGET_DIR}/
                '''
            }
        }

        // stage('Restart Application on NAS') {
        //     steps {
        //         sshagent(credentials: ['ssh-amecwebtest1']) {
        //            sh """
        //             ssh -o StrictHostKeyChecking=no Administrator@amecwebtest1 << 'EOF'
        //                 ls -la
        //                 pm2 reload api
        //             EOF """
        //         }
        //     }
        // }
    }
}