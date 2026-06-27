pipeline {
    agent any

    parameters {
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
                    // --- 1. ตรวจสอบว่าเป็นการกด Build เองจากหน้าเว็บหรือไม่
                    // currentBuild.getBuildCauses() จะคืนค่า list ของสาเหตุการ Build
                    // ถ้ามี 'UserIdCause' แสดงว่ามีคนมากดปุ่ม Build ใน Jenkins
                    def isManualTrigger = currentBuild.getBuildCauses().toString().contains('UserIdCause')

                    // --- 2. ตรวจสอบเงื่อนไข
                    // จะไป Production ได้ต้อง: กดมือเอง (Manual) AND เลือก Parameter เป็น production
                    if (isManualTrigger && params.DEPLOY_ENV == 'production') {
                        env.TARGET_DIR = '/var/amecweb/wwwroot/production/api'
                        env.REMOTE_HOST = 'amecweb1, amecweb2'
                        env.ENV_CRED_ID = 'api-env-prod'
                        env.ENV_DIR = '/var/amecweb/file/env/api/.env.api.production'
                        env.NODE_ENV = 'production'
                        env.NAS_PATH = "\\\\172.21.255.188\\amecweb\\wwwroot\\production"
                        echo ">>> MANUAL BUILD: Deploying to PRODUCTION"
                    }
                    // กรณีอื่นๆ (เช่น GitLab Webhook ผลักมา หรือกดมือแต่เลือก development)
                    else {
                        env.TARGET_DIR = '/var/amecweb/wwwroot/development/api'
                        env.NAS_PATH = "\\\\172.21.255.188\\amecweb\\wwwroot\\development"
                        env.REMOTE_HOST = 'amecwebtest'
                        env.ENV_CRED_ID = 'api-env-file'
                        env.ENV_DIR = '/var/amecweb/file/env/api/.env.api.development'
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
                script {
                    env.START_TIME_CHECKOUT = System.currentTimeMillis()
                    echo "⏱️ [START] Checkout : ${new Date().format('yyyy-MM-dd HH:mm:ss')}"
                }

                // ================== โค้ดเดิมของคุณ ==================
                checkout scm
                // =================================================

                script {
                    def duration = (System.currentTimeMillis() - env.START_TIME_CHECKOUT.toLong()) / 1000
                    echo "✅ [END] Checkout ใช้เวลาทั้งหมด: ${duration} วินาที"
                }
            }
        }

        stage('Check package.json Changes') {
            steps {
                script {
                    env.START_TIME_CHANGE = System.currentTimeMillis()
                    echo "⏱️ [START] Check package.json Changes : ${new Date().format('yyyy-MM-dd HH:mm:ss')}"

                    // 1. กำหนดชื่อไฟล์ Hash ตาม Environment ที่กำลังจะ Deploy
                    def hashFileName = ".package_hash_${params.DEPLOY_ENV}"

                    // 2. คำนวณ Hash ของ package.json ตัวปัจจุบันที่เพิ่ง Checkout มา
                    def currentHash = sh(script: "md5sum package.json | cut -d' ' -f1", returnStdout: true).trim()

                    // 3. ตรวจสอบสถานะการเปลี่ยนแปลง
                    if (fileExists(hashFileName)) {
                        def oldHash = readFile(hashFileName).trim()
                        if (currentHash != oldHash) {
                            env.PACKAGE_STATUS = "CHANGED"
                        } else {
                            env.PACKAGE_STATUS = "UNCHANGED"
                        }
                    } else {
                        env.PACKAGE_STATUS = "NEW"
                    }

                    if (env.PACKAGE_STATUS == "CHANGED" || env.PACKAGE_STATUS == "NEW") {
                        echo "⚠️  WARNING: package.json has changed!"
                        echo "⚠️  You need to run: npm install manually"
                        mail (
                            to: 'sec_wsd@MitsubishiElevatorAsia.co.th',
                            subject: "WARNING: package.json has changed! You need to run: npm install manually (${params.DEPLOY_ENV})",
                            from: 'jenkins-notify@MitsubishiElevatorAsia.co.th',
                            body: """
                                Dear Team,
                                The package.json file has changed in the latest deployment to '${params.DEPLOY_ENV}' environment. Please run 'npm install' in the target directory to ensure all dependencies are up to date.
                                -------------------------------------------
                                How to procedure:
                                1. Map Network Drive to target directory on ${REMOTE_HOST}
                                2. Open Command Prompt or PowerShell and CD to api/
                                3. run: npm install
                                4. Remote Desktop at ${REMOTE_HOST}
                                5. Open Terminal and run: pm2 reload api
                                -------------------------------------------
                            """
                        )
                    }else {
                        echo "✅ package.json has not changed."
                    }

                    // 4. เมื่อ Deploy เสร็จแล้ว ค่อยบันทึก Hash ปัจจุบันทับลงไป
                    writeFile(file: hashFileName, text: currentHash)

                    def duration = (System.currentTimeMillis() - env.START_TIME_CHANGE.toLong()) / 1000
                    echo "✅ [END] Check package.json Changes ใช้เวลาทั้งหมด: ${duration} วินาที"
                }
            }
        }

        stage('Install & Build') {
            steps {
                script {
                    env.START_TIME_BUILD = System.currentTimeMillis()
                    echo "⏱️ [START] Install & Build : ${new Date().format('yyyy-MM-dd HH:mm:ss')}"
                }
                sh '''
                    cp ${ENV_DIR} .env
                    NODE_ENV=development
                    if [ "${PACKAGE_STATUS}" = "CHANGED" ] || [ "${PACKAGE_STATUS}" = "NEW" ]; then
                        npm install
                    else
                        echo "✅ package.json unchanged, skip npm install"
                    fi
                    npm run build
                '''
                sh "tar -czf dist.tar.gz dist/"
                script {
                    def duration = (System.currentTimeMillis() - env.START_TIME_BUILD.toLong()) / 1000
                    echo "✅ [END] Install & Build ใช้เวลาทั้งหมด: ${duration} วินาที"
                }
            }
        }

        stage('Restart Application on Development Server') {
            when { expression { params.DEPLOY_ENV == 'development' }}
            steps {
                script {
                    env.START_TIME_BUILD = System.currentTimeMillis()
                    echo "⏱️ [START] Restart Application : ${new Date().format('yyyy-MM-dd HH:mm:ss')}"

                    sshagent(credentials: ['ssh-amecwebtest1']) {
                        sh "scp -o StrictHostKeyChecking=no dist.tar.gz package.json package-lock.json ignored-endpoints.txt ecosystem.config.js .env Administrator@amecwebtest1:D:/wwwroot/api/"

                        if (env.PACKAGE_STATUS == "CHANGED" || env.PACKAGE_STATUS == "NEW") {
                            sh """
                                ssh -o StrictHostKeyChecking=no Administrator@amecwebtest1 << 'EOF'
                                powershell "
                                \$startTime = Get-Date
                                \$env:NODE_ENV='development'
                                cd D:\\wwwroot\\api
                                tar -xzf dist.tar.gz
                                Remove-Item -Path dist.tar.gz -Force
                                \$endTime = Get-Date
                                \$duration = (\$endTime - \$startTime).TotalSeconds
                                Write-Host '✅ [END] Extracting files สำเร็จ! ใช้เวลาทั้งหมด:' \$duration 'วินาที'
                                "
                                EOF
                            """

                            echo "================================================"
                            echo "⚠️  WARNING: package.json has changed!, Please install dependencies manually on ${REMOTE_HOST}"
                            echo "Skipping automatic PM2 reload..."
                            echo "================================================"
                        } else {
                            sh """
                                ssh -o StrictHostKeyChecking=no Administrator@amecwebtest1 << 'EOF'
                                powershell "
                                \$startTime = Get-Date
                                \$env:NODE_ENV='development'
                                cd D:\\wwwroot\\api
                                tar -xzf dist.tar.gz
                                Remove-Item -Path dist.tar.gz -Force
                                \$endTime = Get-Date
                                \$duration = (\$endTime - \$startTime).TotalSeconds
                                Write-Host '🎉 [END] Extracting files สำเร็จ! ใช้เวลาทั้งหมด:' \$duration 'วินาที'


                                \$startTimePm2 = Get-Date
                                pm2 reload api
                                \$endTimePm2 = Get-Date
                                \$durationPm2 = (\$endTimePm2 - \$startTimePm2).TotalSeconds
                                Write-Host '🎯 [END] PM2 reload สำเร็จ! ใช้เวลาทั้งหมด:' \$durationPm2 'วินาที'
                                "
                                EOF
                            """
                        }
                        sh "rm -f dist.tar.gz"
                    }


                    def duration = (System.currentTimeMillis() - env.START_TIME_BUILD.toLong()) / 1000
                    echo "✅ [END] Restart Application ใช้เวลาทั้งหมด: ${duration} วินาที"
                }
            }
        }

        stage('Restart Application on NAS for Production') {
            when { expression { params.DEPLOY_ENV == 'production'} }
            steps {
                script {
                    if (env.PACKAGE_STATUS == "CHANGED" || env.PACKAGE_STATUS == "NEW") {
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
                        // ==================== Restart Application on AMECWEB ==================== //
                        env.START_TIME_BUILD1 = System.currentTimeMillis()
                        echo "⏱️ [START] Restart Application AMECWEB1 : ${new Date().format('yyyy-MM-dd HH:mm:ss')}"

                        sh "tar -czf dist.tar.gz dist/"

                        sshagent(credentials: ['ssh-amecweb1']) {
                            sh "scp -o StrictHostKeyChecking=no dist.tar.gz package.json package-lock.json ignored-endpoints.txt ecosystem.config.js .env Administrator@amecweb1:D:/wwwroot/api/"

                            sh """
                                ssh -o StrictHostKeyChecking=no Administrator@amecweb1 << 'EOF'
                                powershell "
                                \$env:NODE_ENV='development'
                                cd D:\\wwwroot\\api
                                tar -xzf dist.tar.gz
                                Remove-Item -Path dist.tar.gz -Force
                                # pm2 reload api
                                "
                                EOF
                            """
                        }

                        def duration = (System.currentTimeMillis() - env.START_TIME_BUILD1.toLong()) / 1000
                        echo "✅ [END] Restart Application AMECWEB1 ใช้เวลาทั้งหมด: ${duration} วินาที"

                        // ==================== Restart Application on AMECWEB2 ==================== //
                        env.START_TIME_BUILD2 = System.currentTimeMillis()
                        echo "⏱️ [START] Restart Application AMECWEB2 : ${new Date().format('yyyy-MM-dd HH:mm:ss')}"

                        sshagent(credentials: ['ssh-amecweb2']) {
                            sh "scp -o StrictHostKeyChecking=no dist.tar.gz package.json package-lock.json ignored-endpoints.txt ecosystem.config.js .env Administrator@amecweb2:D:/wwwroot/api/"

                            sh """
                                ssh -o StrictHostKeyChecking=no Administrator@amecweb2 << 'EOF'
                                powershell "
                                \$env:NODE_ENV='development'
                                cd D:\\wwwroot\\api
                                tar -xzf dist.tar.gz
                                Remove-Item -Path dist.tar.gz -Force
                                # pm2 reload api
                                "
                                EOF
                            """
                        }

                        def duration2 = (System.currentTimeMillis() - env.START_TIME_BUILD2.toLong()) / 1000
                        echo "✅ [END] Restart Application AMECWEB2 ใช้เวลาทั้งหมด: ${duration} วินาที"

                        sh "rm -f dist.tar.gz"
                    }
                }
            }
        }
    }
}
