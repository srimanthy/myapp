
pipeline {
  agent none

  stages {
    stage('Checkout') {
      agent any
      steps {
        checkout scm
      }
    }

    stage('Install & Test') {
      agent { docker { image 'node:20-alpine' } }
      steps {
        sh 'npm install'
        sh 'npm test'
      }
    }

    stage('Build & Push') {
      agent {
        docker {
          image 'docker:20.10.24-dind'
          args  '--privileged -v /var/run/docker.sock:/var/run/docker.sock'
        }
      }
      steps {
        // ensure code is here
        sh 'ls -lah .'              // sanity check
        sh 'cat Dockerfile'         // you should see your Dockerfile

        // build
        sh 'docker build -t srimanthy/myapp:${BUILD_NUMBER} .'

        // push
        withCredentials([usernamePassword(
          credentialsId: 'docker-hub',
          usernameVariable: 'DOCKER_USER',
          passwordVariable: 'DOCKER_PASS'
        )]) {
          sh 'echo $DOCKER_PASS | docker login -u $DOCKER_USER --password-stdin'
          sh 'docker push srimanthy/myapp:${BUILD_NUMBER}'
        }
      }
    }
  }

  post {
    success { echo "✅ Built & pushed srimanthy/myapp:${BUILD_NUMBER}" }
    failure { echo "❌ Build or push failed — check above logs" }
  }
}

