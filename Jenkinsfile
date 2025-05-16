pipeline {
  agent { docker { image 'node:20-alpine' } }

  environment {
    IMAGE = 'myapp'
    REG_CREDS = 'dockerhub' // ID from Jenkins credentials
  }

  stages {
    stage('Install') {
      steps {
        sh 'npm install'
      }
    }

    stage('Build Docker Image') {
      steps {
        script {
          docker.withRegistry('', REG_CREDS) {
            docker.build("${IMAGE}:${env.BUILD_NUMBER}").push('latest')
          }
        }
      }
    }
  }

  post {
    success { echo "✅ Build finished!" }
    failure { echo "❌ Something broke!" }
  }
}
