pipeline {
  agent any
  environment {
    IMAGE = 'srimanthy/myapp'      // <-- your DockerHub repo
  }

  stages {
    stage('Install & Test') {
      agent { docker { image 'node:20-alpine' } }
      steps {
        sh 'npm install'
        sh 'npm test'
      }
    }

    stage('Build Docker Image') {
      agent {
        docker {
          image 'docker:20.10.24-dind'
          args  '--privileged -v /var/run/docker.sock:/var/run/docker.sock'
        }
      }
      steps {
        sh 'docker build -t $IMAGE:${BUILD_NUMBER} .'
      }
    }

    stage('Push to Docker Hub') {
      agent {
        docker {
          image 'docker:20.10.24-dind'
          args  '--privileged -v /var/run/docker.sock:/var/run/docker.sock'
        }
      }
      steps {
        withCredentials([usernamePassword(
          credentialsId: 'docker-hub',
          usernameVariable: 'USER',
          passwordVariable: 'PASS'
        )]) {
          sh 'echo $PASS | docker login -u $USER --password-stdin'
          sh 'docker push $IMAGE:${BUILD_NUMBER}'
        }
      }
    }
  }

  post {
    failure { echo '❌ Build or push failed' }
    success { echo '✅ Docker image built & pushed!' }
  }
}



