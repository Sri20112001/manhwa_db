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
            description: 'Execute lint, TypeScript checks, and unit tests before building'
        )
        string(
            name: 'ANDROID_SDK_PATH',
            defaultValue: '',
            description: 'Path to Android SDK if not defined in ANDROID_HOME environment variable'
        )
    }

    tools {
        nodejs 'Node-20'
        jdk 'JDK-17'
    }

    environment {
        CI = 'true'
        EXPO_PUBLIC_API_BASE_URL = "${params.EXPO_API_URL}"
        EXPO_NO_TELEMETRY = '1'
        NODE_OPTIONS = '--max-old-space-size=1536'
        GRADLE_OPTS = '-Dorg.gradle.daemon=false -Dorg.gradle.parallel=false -Dorg.gradle.workers.max=2 -Dorg.gradle.jvmargs="-Xmx1536m -XX:MaxMetaspaceSize=384m"'
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
                    echo "📦 Installing npm dependencies (including devDependencies)..."
                    if (isUnix()) {
                        sh 'npm ci --legacy-peer-deps --include=dev || npm install --legacy-peer-deps --include=dev'
                    } else {
                        bat 'npm ci --legacy-peer-deps --include=dev || npm install --legacy-peer-deps --include=dev'
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
                stage('Test') {
                    steps {
                        script {
                            echo "🧪 Running unit & regression tests..."
                            if (isUnix()) {
                                sh 'npm test'
                            } else {
                                bat 'npm test'
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
                    def sdkPath = params.ANDROID_SDK_PATH ?: env.ANDROID_HOME ?: env.ANDROID_SDK_ROOT ?: ''
                    
                    if (isUnix()) {
                        sh 'npx expo prebuild --platform android --clean --no-install'
                        dir('android') {
                            sh 'chmod +x gradlew'

                            if (!sdkPath) {
                                def candidates = ['/var/jenkins_home/android-sdk', '/opt/android-sdk', '/usr/lib/android-sdk', "${env.HOME}/Android/Sdk"]
                                for (c in candidates) {
                                    if (fileExists(c)) {
                                        sdkPath = c
                                        break
                                    }
                                }
                            }

                            if (sdkPath) {
                                echo "📍 Using Android SDK at: ${sdkPath}"
                                writeFile file: 'local.properties', text: "sdk.dir=${sdkPath}\n"
                            } else {
                                error "❌ Android SDK not found! Please define ANDROID_HOME in Jenkins (Manage Jenkins -> System -> Global Properties), pass ANDROID_SDK_PATH parameter, or select BUILD_TARGET='web'."
                            }

                            if (params.BUILD_TYPE == 'release') {
                                sh './gradlew assembleRelease --no-daemon --max-workers=2'
                            } else {
                                sh './gradlew assembleDebug --no-daemon --max-workers=2'
                            }
                        }
                    } else {
                        bat 'npx expo prebuild --platform android --clean --no-install'
                        dir('android') {
                            if (sdkPath) {
                                writeFile file: 'local.properties', text: "sdk.dir=${sdkPath.replace('\\', '/')}\n"
                            }
                            if (params.BUILD_TYPE == 'release') {
                                bat 'gradlew.bat assembleRelease --no-daemon --max-workers=2'
                            } else {
                                bat 'gradlew.bat assembleDebug --no-daemon --max-workers=2'
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
