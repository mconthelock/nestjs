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
                        env.TARGET_DIR = '/var/amecweb/wwwroot/production/api'
                        env.REMOTE_HOST = 'amecweb1, amecweb2'
                        env.ENV_CRED_ID = 'api-env-prod'
                        // env.ENV_CRED_ID = 'apitest-env-prod'
                        env.NODE_ENV = 'production'
                        env.NAS_PATH = "\\\\172.21.255.188\\amecweb\\wwwroot\\production"
                        echo ">>> MANUAL BUILD: Deploying to PRODUCTION"
                    }
                    // กรณีอื่นๆ (เช่น GitLab Webhook ผลักมา หรือกดมือแต่เลือก development)
                    else {
                        env.TARGET_DIR = '/var/amecweb/wwwroot/development/api'
                        env.REMOTE_HOST = 'amecwebtest'
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
                script {
                    // เช็ค package.json ก่อน deploy
                    def packageChanged = sh(
                        script: """
                            if [ -f ${TARGET_DIR}/package.json ]; then
                                OLD_HASH=\$(md5sum ${TARGET_DIR}/package.json | cut -d' ' -f1)
                                NEW_HASH=\$(md5sum package.json | cut -d' ' -f1)
                                if [ "\$OLD_HASH" != "\$NEW_HASH" ]; then
                                    echo "CHANGED"
                                else
                                    echo "UNCHANGED"
                                fi
                            else
                                echo "NEW"
                            fi
                        """,
                        returnStdout: true
                    ).trim()

                    env.PACKAGE_STATUS = packageChanged

                    if (packageChanged == "CHANGED") {
                        echo "⚠️  WARNING: package.json has changed!"
                        echo "⚠️  You need to run: npm install manually"
                        mail (
                            to: 'sec_wsd@MitsubishiElevatorAsia.co.th',
                            subject: "⚠️WARNING: package.json has changed! You need to run: npm install manually (${params.DEPLOY_ENV})",
                            from: 'jenkins-notify@MitsubishiElevatorAsia.co.th',
                            body: """
                                Dear Team,
                                The package.json file has changed in the latest deployment to ${params.DEPLOY_ENV} environment. Please log in to the NAS server and run 'npm install' in the target directory to ensure all dependencies are up to date.
                                -------------------------------------------
                                ขั้นตอนที่ต้องทำ:
                                1. CD ไปที่ ${TARGET_DIR}
                                2. รันคำสั่ง: npm install
                                3. Remote Desktop ไปที่ ${REMOTE_HOST}
                                4. เปิด Terminal
                                5. รันคำสั่ง: pm2 reload api
                            """
                        )
                    } else if (packageChanged == "NEW") {
                        echo "ℹ️  First deployment detected"
                    } else {
                        echo "✓ package.json unchanged"
                    }
                }

                sh '''
                    mkdir -p ${TARGET_DIR}
                    rsync -rlptz --delete --no-perms --no-owner --no-group dist/ ${TARGET_DIR}/dist/
                    rsync -av public/ ${TARGET_DIR}/public/
                    rsync -vpt package.json package-lock.json ignored-endpoints.txt ecosystem.config.js .env ${TARGET_DIR}/

                    echo "Deploy completed"
                '''
            }
        }

        stage('Restart Application on NAS for Development') {
            when { expression { params.DEPLOY_ENV == 'development' }}
            steps {
                script {
                    if (env.PACKAGE_STATUS == "CHANGED") {
                        echo "================================================"
                        echo "⚠️  WARNING: package.json has changed!"
                        echo "⚠️  Please run manually:"
                        echo "    1. CD ไปที่ ${TARGET_DIR}"
                        echo "    2. รันคำสั่ง: npm install"
                        echo "    3. Remote Desktop ไปที่ ${REMOTE_HOST}"
                        echo "    4. เปิด Terminal"
                        echo "    5. รันคำสั่ง: pm2 reload api"
                        echo "================================================"
                        echo "Skipping automatic PM2 reload..."
                    } else {
                        sshagent(credentials: ['ssh-amecwebtest1']) {
                            withCredentials([usernamePassword(credentialsId: 'nas-auth-id', passwordVariable: 'NAS_PASS', usernameVariable: 'NAS_USER')]) {
                                echo "Current start at: $(date)"
                                sh """
                                    ssh -o StrictHostKeyChecking=no Administrator@amecwebtest1 << 'EOF'
                                    powershell "
                                    \$pass = '${NAS_PASS}'
                                    \$secPass = ConvertTo-SecureString \$pass -AsPlainText -Force
                                    \$cred = New-Object System.Management.Automation.PSCredential('${NAS_USER}', \$secPass)

                                    if (Get-PSDrive -Name 'Z' -ErrorAction SilentlyContinue) {
                                        Remove-PSDrive -Name 'Z' -Force
                                    }

                                    New-PSDrive -Name 'Z' -PSProvider FileSystem -Root '${env.NAS_PATH}' -Credential \$cred -Scope Global -ErrorAction Stop
                                    Set-Location Z:

                                    \$env:NODE_ENV='development'
                                    cd api
                                    pm2 reload ecosystem.config.js

                                    Remove-PSDrive -Name 'Z' -Force
                                    "
                                EOF
                                """

                                echo "Finished at: $(date)"
                            }
                        }
                    }
                }
            }
        }

        stage('Restart Application on NAS for Production') {
            when { expression { params.DEPLOY_ENV == 'production'} }
            steps {
                script {
                    if (env.PACKAGE_STATUS == "CHANGED") {
                        echo "================================================"
                        echo "⚠️  WARNING: package.json has changed!"
                        echo "⚠️  Please run manually:"
                        echo "    1. CD ไปที่ ${TARGET_DIR}"
                        echo "    2. รันคำสั่ง: npm install"
                        echo "    3. Remote Desktop ไปที่ ${REMOTE_HOST}"
                        echo "    4. เปิด Terminal"
                        echo "    5. รันคำสั่ง: pm2 reload api"
                        echo "================================================"
                        echo "Skipping automatic PM2 reload..."
                    } else {
                        withCredentials([usernamePassword(credentialsId: 'nas-auth-id', passwordVariable: 'NAS_PASS', usernameVariable: 'NAS_USER')]) {
                            sshagent(credentials: ['ssh-amecweb1']) {
                                sh """
                                    ssh -o StrictHostKeyChecking=no Administrator@amecweb1 << 'EOF'
                                    powershell "
                                    \$pass = '${NAS_PASS}'
                                    \$secPass = ConvertTo-SecureString \$pass -AsPlainText -Force
                                    \$cred = New-Object System.Management.Automation.PSCredential('${NAS_USER}', \$secPass)

                                    if (Get-PSDrive -Name 'Z' -ErrorAction SilentlyContinue) {
                                        Remove-PSDrive -Name 'Z' -Force
                                    }

                                    New-PSDrive -Name 'Z' -PSProvider FileSystem -Root '${env.NAS_PATH}' -Credential \$cred -Scope Global -ErrorAction Stop
                                    Set-Location Z:\\\\api

                                    \$env:NODE_ENV = 'production'
                                    pm2 reload ecosystem.config.js
                                    Remove-PSDrive -Name Z -Force
                                    "
                                EOF
                                """
                            }
                            sshagent(credentials: ['ssh-amecweb2']) {
                                sh """
                                    ssh -o StrictHostKeyChecking=no Administrator@amecweb2 << 'EOF'
                                    powershell "
                                    \$pass = '${NAS_PASS}'
                                    \$secPass = ConvertTo-SecureString \$pass -AsPlainText -Force
                                    \$cred = New-Object System.Management.Automation.PSCredential('${NAS_USER}', \$secPass)

                                    if (Get-PSDrive -Name 'Z' -ErrorAction SilentlyContinue) {
                                        Remove-PSDrive -Name 'Z' -Force
                                    }

                                    New-PSDrive -Name 'Z' -PSProvider FileSystem -Root '${env.NAS_PATH}' -Credential \$cred -Scope Global -ErrorAction Stop
                                    Set-Location Z:\\\\api

                                    pm2 reload ecosystem.config.js
                                    Remove-PSDrive -Name 'Z' -Force
                                    "
                                EOF
                                """
                            }
                        }
                    }
                }
            }
        }
    }
}
