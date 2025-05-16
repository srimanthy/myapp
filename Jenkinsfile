pipeline {
  agent none                                // no default agent

  environment {
    IMAGE = 'srimanthy/myapp'               // ← your Docker Hub repo
    // inject your Docker Hub creds as DOCKERHUB_USR & DOCKERHUB_PSW
    DOCKERHUB = credentials('docker-hub')
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
      environment {
        DOCKERHUB_USR = "${DOCKERHUB_USR}"
        DOCKERHUB_PSW = "${DOCKERHUB_PSW}"
      }
      steps {
        // build
        sh 'docker build -t $IMAGE:${BUILD_NUMBER} .'

        // login & push
        sh 'echo $DOCKERHUB_PSW | docker login -u $DOCKERHUB_USR --password-stdin'
        sh 'docker push $IMAGE:${BUILD_NUMBER}'
      }
    }
  }

  post {
    success { echo "✅ Image $IMAGE:${BUILD_NUMBER} built & pushed" }
    failure { echo "❌ Build or push failed — check console" }
  }
}

