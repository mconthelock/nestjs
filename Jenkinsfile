pipeline {
    agent any

    parameters {
        // เผื่อไว้ในกรณีที่อยากกดเลือกเองตอนสั่ง Build แบบ Manual
        choice(name: 'DEPLOY_ENV', choices: ['development', 'production'], description: 'Select Environment to deploy')
    }

    environment {
        GIT_SSL_NO_VERIFY = 'true'
    }

    tools {
        nodejs 'node'
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
                        // env.ENV_CRED_ID = 'apitest-env-prod'
                        env.NODE_ENV = 'production'
                        env.NAS_PATH = "\\\\172.21.255.188\\amecweb\\wwwroot\\production"
                        echo ">>> MANUAL BUILD: Deploying to PRODUCTION"
                    }
                    // กรณีอื่นๆ (เช่น GitLab Webhook ผลักมา หรือกดมือแต่เลือก development)
                    else {
                        env.TARGET_DIR = '/var/amecweb/wwwroot/development/api'
                        env.ENV_CRED_ID = 'api-env-file'
                        env.NODE_ENV = 'development'
                        env.NAS_PATH = "\\\\172.21.255.188\\amecweb\\wwwroot\\development"

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
                // checkout scmGit(
                //     branches: [[name: '*/main']],
                //     userRemoteConfigs: [[
                //         url: 'https://webhub.mitsubishielevatorasia.co.th/wsd/api.git',
                //         credentialsId: 'gitlab-auth-id']
                //     ]
                // )
                checkout scm
            }
        }

        stage('Install & Build') {
            steps {
                withCredentials([file(credentialsId: "${env.ENV_CRED_ID}", variable: 'ENV_FILE')]) {
                    sh '''
                        NODE_ENV=development
                        npm install
                        npm run build
                        cp ${ENV_FILE} .env
                    '''
                }
            }
        }

        stage('Deploy to NAS') {
            steps {
                sh '''
                    mkdir -p ${TARGET_DIR}
                    rsync -rlptz --delete --no-perms --no-owner --no-group dist/ ${TARGET_DIR}/dist/
                    rsync -av public/ ${TARGET_DIR}/public/
                    rsync -vpt package.json package-lock.json ignored-endpoints.txt ecosystem.config.js .env ${TARGET_DIR}/

                    echo "Testing write access to target directory..."
                    
                '''
            }
        }

        // stage('Restart Application on NAS for Development') {
        //     when { expression { params.DEPLOY_ENV == 'development' }}
        //     steps {
        //         sshagent(credentials: ['ssh-amecwebtest1']) {
        //             withCredentials([usernamePassword(credentialsId: 'nas-auth-id', passwordVariable: 'NAS_PASS', usernameVariable: 'NAS_USER')]) {
        //                 sh """
        //                     ssh -o StrictHostKeyChecking=no Administrator@amecwebtest1 << 'EOF'
        //                     powershell "
        //                     \$pass = '${NAS_PASS}'
        //                     \$secPass = ConvertTo-SecureString \$pass -AsPlainText -Force
        //                     \$cred = New-Object System.Management.Automation.PSCredential('${NAS_USER}', \$secPass)

        //                     if (Get-PSDrive -Name 'Z' -ErrorAction SilentlyContinue) {
        //                         Remove-PSDrive -Name 'Z' -Force
        //                     }

        //                     New-PSDrive -Name 'Z' -PSProvider FileSystem -Root '${env.NAS_PATH}' -Credential \$cred -Scope Global -ErrorAction Stop
        //                     Set-Location Z:

        //                     \$env:NODE_ENV='development'
        //                     cd api
        //                     pm2 reload ecosystem.config.js

        //                     Remove-PSDrive -Name 'Z' -Force
        //                     "
        //                 EOF
        //                 """
        //             }
        //         }
        //     }
        // }

        stage('Restart Application on NAS for Production') {
            when { expression { params.DEPLOY_ENV == 'production'} }
            steps {
                withCredentials([usernamePassword(credentialsId: 'nas-auth-id', passwordVariable: 'NAS_PASS', usernameVariable: 'NAS_USER')]) {
                    // Server 1: amecweb1
                    sshagent(credentials: ['ssh-amecweb1']) {
                        sh """
                            ssh -o StrictHostKeyChecking=no Administrator@amecweb1 powershell -NoProfile -Command "
                            \$pass = '${NAS_PASS}';
                            \$secPass = ConvertTo-SecureString \$pass -AsPlainText -Force;
                            \$cred = New-Object System.Management.Automation.PSCredential('${NAS_USER}', \$secPass);

                            if (Get-PSDrive -Name 'Z' -ErrorAction SilentlyContinue) { Remove-PSDrive -Name 'Z' -Force };

                            New-PSDrive -Name 'Z' -PSProvider FileSystem -Root '${env.NAS_PATH}' -Credential \$cred -Scope Global -ErrorAction Stop;
                            Set-Location Z:\\api_test;
                            dir;

                            \$env:NODE_ENV='production';

                            if (Test-Path node_modules) { cmd /c rmdir /s /q node_modules };

                            npm ci --omit=dev;

                            node -e \\"require('sharp'); console.log('sharp OK')\\";

                            Remove-PSDrive -Name 'Z' -Force;
                            "
                        """
                    }

                    // sshagent(credentials: ['ssh-amecweb2']) {
                    //     sh """
                    //         ssh -o StrictHostKeyChecking=no Administrator@amecweb2 << 'EOF'
                    //         powershell "
                    //         \$pass = '${NAS_PASS}'
                    //         \$secPass = ConvertTo-SecureString \$pass -AsPlainText -Force
                    //         \$cred = New-Object System.Management.Automation.PSCredential('${NAS_USER}', \$secPass)

                    //         if (Get-PSDrive -Name 'Z' -ErrorAction SilentlyContinue) {
                    //             Remove-PSDrive -Name 'Z' -Force
                    //         }

                    //         New-PSDrive -Name 'Z' -PSProvider FileSystem -Root '${env.NAS_PATH}' -Credential \$cred -Scope Global -ErrorAction Stop
                    //         Set-Location Z:

                    //         \$env:NODE_ENV='production'
                    //         cd api
                    //         pm2 reload ecosystem.config.js
                    //         Remove-PSDrive -Name 'Z' -Force
                    //         "
                    //     EOF
                    //     """
                    // }
                }
            }
        }
    }
}