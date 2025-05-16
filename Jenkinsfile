pipeline {
  agent { docker { image 'node:20-alpine' } }

  stages {
    stage('Install') {
      steps {
        sh 'npm install'
      }
    }

    stage('Build Docker Image') {
      steps {
        script {
          docker.build("myapp:${env.BUILD_NUMBER}")
        }
      }
    }
  }

  post {
    failure {
      echo '❌ Build failed!'
    }
    success {
      echo '✅ Build complete!'
    }
  }
}

