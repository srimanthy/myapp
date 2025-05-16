pipeline {
  agent none                        // start with “no default” agent
  environment {
    IMAGE = 'srimanthy/myapp'       // ← your Docker Hub repo
  }

  stages {
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
        // 1) build
        sh 'docker build -t $IMAGE:${BUILD_NUMBER} .'

        // 2) push
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
    success { echo '✅ Image built & pushed!' }
    failure { echo '❌ Something broke!' }
  }
}

