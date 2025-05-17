pipeline {
  agent none
  environment { IMAGE = 'srimanthy/myapp' }

  stages {
    stage('Checkout') {
      agent any
      steps { checkout scm }
    }

    stage('Install & Test') {
      agent { docker { image 'node:20-alpine' } }
      steps {
        sh 'npm install'
        sh 'npm test || true'
      }
    }

    stage('Build & Push') {
      agent {
        docker {
          image 'docker:20.10.24-dind'
          // run container as root and give it the host socket
          user  'root'
          args  '--privileged -v /var/run/docker.sock:/var/run/docker.sock'
        }
      }
      steps {
        sh 'docker build -t $IMAGE:${BUILD_NUMBER} .'
        withCredentials([usernamePassword(
          credentialsId: 'docker-hub',
          usernameVariable: 'DOCKER_USER',
          passwordVariable: 'DOCKER_PASS'
        )]) {
          sh 'echo $DOCKER_PASS | docker login -u $DOCKER_USER --password-stdin'
          sh 'docker push $IMAGE:${BUILD_NUMBER}'
        }
      }
    }
  }

  post {
    success { echo "✅ Built & pushed $IMAGE:${BUILD_NUMBER}" }
    failure { echo "❌ Build or push failed — check logs" }
  }
}

