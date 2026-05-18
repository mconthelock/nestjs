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
                    def isManualTrigger = currentBuild.getBuildCauses().toString().contains('UserIdCause')

                    if (isManualTrigger && params.DEPLOY_ENV == 'production') {
                        env.TARGET_DIR = '/var/amecweb/wwwroot/production/api'
                        env.REMOTE_HOST = 'amecweb1, amecweb2'
                        env.ENV_CRED_ID = 'api-env-prod'
                        env.ENV_DIR = '/var/amecweb/file/env/api/.env.api.production'
                        env.NODE_ENV = 'production'
                        env.NAS_PATH = "\\\\172.21.255.188\\amecweb\\wwwroot\\production"
                        // 🌟 เพิ่มตัวแปรชื่อ Service
                        env.SERVICE_NAME = 'AmecWebApiProd'
                        echo ">>> MANUAL BUILD: Deploying to PRODUCTION"
                    }
                    else {
                        env.TARGET_DIR = '/var/amecweb/wwwroot/development/api'
                        env.REMOTE_HOST = 'amecwebtest1'
                        env.ENV_CRED_ID = 'api-env-file'
                        env.ENV_DIR = '/var/amecweb/file/env/api/.env.api.development'
                        env.NODE_ENV = 'development'
                        env.NAS_PATH = "\\\\172.21.255.188\\amecweb\\wwwroot\\development"
                        // 🌟 เพิ่มตัวแปรชื่อ Service
                        env.SERVICE_NAME = 'AmecWebApiDev'

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
                checkout scm
            }
        }

        stage('Install & Build') {
            steps {
                sh '''
                    cp ${ENV_DIR} .env
                    NODE_ENV=development
                    npm install
                    npm run build
                '''
            }
        }

        stage('Deploy to NAS') {
            steps {
                script {
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
                            subject: "⚠️WARNING: package.json has changed! (${params.DEPLOY_ENV})",
                            from: 'jenkins-notify@MitsubishiElevatorAsia.co.th',
                            body: """
                                Dear Team,
                                The package.json file has changed in the latest deployment to ${params.DEPLOY_ENV} environment.
                                Please log in to the NAS server and run 'npm install' in the target directory to ensure all dependencies are up to date.
                                -------------------------------------------
                                ขั้นตอนที่ต้องทำ:
                                1. CD ไปที่ ${TARGET_DIR} (บน NAS)
                                2. รันคำสั่ง: npm install
                                3. Remote Desktop ไปที่ ${REMOTE_HOST}
                                4. เปิด PowerShell (Run as Administrator)
                                5. รันคำสั่ง: Restart-Service -Name "${SERVICE_NAME}"
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

        // 🌟 Stage ใหม่ที่คลีนขึ้นมากสำหรับการ Restart
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
                        echo "    4. เปิด PowerShell (Run as Administrator)"
                        echo "    5. รันคำสั่ง: Restart-Service -Name '${SERVICE_NAME}'"
                        echo "================================================"
                        echo "Skipping automatic Service reload..."
                    } else {
                        sshagent(credentials: ['ssh-amecwebtest1']) {
                            sh "date '+%Y-%m-%d %H:%M:%S'"
                            sh """
                                ssh -o StrictHostKeyChecking=no Administrator@amecwebtest1 "powershell Restart-Service -Name '${SERVICE_NAME}' -Force"
                            """
                            sh "date '+%Y-%m-%d %H:%M:%S'"
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
                        echo "    4. เปิด PowerShell (Run as Administrator)"
                        echo "    5. รันคำสั่ง: Restart-Service -Name '${SERVICE_NAME}'"
                        echo "================================================"
                        echo "Skipping automatic Service reload..."
                    } else {
                        sshagent(credentials: ['ssh-amecweb1']) {
                            sh "date '+%Y-%m-%d %H:%M:%S'"
                            sh """
                                ssh -o StrictHostKeyChecking=no Administrator@amecweb1 "powershell Restart-Service -Name '${SERVICE_NAME}' -Force"
                            """
                            sh "date '+%Y-%m-%d %H:%M:%S'"
                        }
                        sshagent(credentials: ['ssh-amecweb2']) {
                            sh "date '+%Y-%m-%d %H:%M:%S'"
                            sh """
                                ssh -o StrictHostKeyChecking=no Administrator@amecweb2 "powershell Restart-Service -Name '${SERVICE_NAME}' -Force"
                            """
                            sh "date '+%Y-%m-%d %H:%M:%S'"
                        }
                    }
                }
            }
        }
    }
}