pipeline {
    agent any

    parameters {
        choice(
            name: 'BUILD_TARGET',
            choices: ['web', 'android', 'all'],
            description: 'Select which platform artifacts to build'
        )
        choice(
            name: 'BUILD_TYPE',
            choices: ['release', 'debug'],
            description: 'Android build variant (ignored for web)'
        )
        string(
            name: 'EXPO_API_URL',
            defaultValue: 'https://pornhwadb.com/api/v1',
            description: 'API Base URL for EXPO_PUBLIC_API_BASE_URL'
        )
        booleanParam(
            name: 'RUN_TESTS',
            defaultValue: true,
            description: 'Execute lint and TypeScript checks before building'
        )
    }

    tools {
        nodejs 'Node-20'
        jdk 'JDK-17'
    }

    environment {
        CI = 'true'
        NODE_ENV = 'production'
        EXPO_PUBLIC_API_BASE_URL = "${params.EXPO_API_URL}"
        EXPO_NO_TELEMETRY = '1'
        GRADLE_OPTS = '-Dorg.gradle.daemon=false -Dorg.gradle.jvmargs="-Xmx2048m -XX:MaxMetaspaceSize=512m"'
    }

    options {
        timeout(time: 45, unit: 'MINUTES')
        buildDiscarder(logRotator(numToKeepStr: '10', artifactNumToKeepStr: '5'))
        disableConcurrentBuilds()
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Install Dependencies') {
            steps {
                script {
                    echo "📦 Installing npm dependencies..."
                    if (isUnix()) {
                        sh 'npm ci --legacy-peer-deps || npm install --legacy-peer-deps'
                    } else {
                        bat 'npm ci --legacy-peer-deps || npm install --legacy-peer-deps'
                    }
                }
            }
        }

        stage('Quality Checks') {
            when {
                expression { params.RUN_TESTS == true }
            }
            parallel {
                stage('Typecheck') {
                    steps {
                        script {
                            echo "🔍 Verifying TypeScript compilation..."
                            if (isUnix()) {
                                sh 'npm run typecheck'
                            } else {
                                bat 'npm run typecheck'
                            }
                        }
                    }
                }
                stage('Lint') {
                    steps {
                        script {
                            echo "🧹 Running ESLint checks..."
                            if (isUnix()) {
                                sh 'npm run lint'
                            } else {
                                bat 'npm run lint'
                            }
                        }
                    }
                }
            }
        }

        stage('Build Web') {
            when {
                expression { params.BUILD_TARGET == 'web' || params.BUILD_TARGET == 'all' }
            }
            steps {
                script {
                    echo "🌐 Exporting web bundle..."
                    if (isUnix()) {
                        sh 'npm run build:web'
                    } else {
                        bat 'npm run build:web'
                    }
                }
                archiveArtifacts artifacts: 'dist/**', fingerprint: true, allowEmptyArchive: false
            }
        }

        stage('Build Android') {
            when {
                expression { params.BUILD_TARGET == 'android' || params.BUILD_TARGET == 'all' }
            }
            steps {
                script {
                    echo "📱 Generating Android native project..."
                    if (isUnix()) {
                        sh 'npx expo prebuild --platform android --clean --no-install'
                        dir('android') {
                            sh 'chmod +x gradlew'
                            if (params.BUILD_TYPE == 'release') {
                                sh './gradlew assembleRelease --no-daemon'
                            } else {
                                sh './gradlew assembleDebug --no-daemon'
                            }
                        }
                    } else {
                        bat 'npx expo prebuild --platform android --clean --no-install'
                        dir('android') {
                            if (params.BUILD_TYPE == 'release') {
                                bat 'gradlew.bat assembleRelease --no-daemon'
                            } else {
                                bat 'gradlew.bat assembleDebug --no-daemon'
                            }
                        }
                    }
                }
                archiveArtifacts artifacts: 'android/app/build/outputs/apk/**/*.apk', fingerprint: true, allowEmptyArchive: false
            }
        }
    }

    post {
        success {
            echo "✅ Build completed successfully for target: ${params.BUILD_TARGET}!"
        }
        failure {
            echo "❌ Pipeline failed! Please inspect logs above."
        }
        always {
            script {
                try {
                    cleanWs deleteDirs: true, notFailBuild: true
                } catch (Throwable t) {
                    echo "Notice: Workspace Cleanup plugin not installed (${t.message}), skipping cleanWs."
                }
            }
        }
    }
}
