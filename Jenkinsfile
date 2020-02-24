pipeline {
    agent any

    environment {
        dockerPath = "${dockerHome}/bin:${env.PATH}"
        DOCKER_ID = "quangle205"
        DOCKER_PASSWORD = credentials('DOCKER_PASSWORD')
        EMAIL_TO = "quangdev205@gmail.com quang.le205@gmail.com"
        DOCKER_VM_BACKEND_IMAGE = "appliedreseach-vm-product-backend"
        DOCKER_VM_FRONTEND_IMAGE = "appliedreseach-vm-product-frontend"
        GIT_COMMIT_HASH = sh "(git rev-parse HEAD)" 
    }

    stages{
        stage('Init'){
            steps {
                echo "INITIALIZE ENVIRONMENTS ..."
                sh "docker --version"
                echo "RUNNING TEST CASES IF ANY ..."
                echo "${GIT_COMMIT_HASH}"
            }
        }

        stage('Build'){
            steps {
                echo "${GIT_COMMIT_HASH}"
                // GIT_COMMIT_HASH = sh "(git rev-parse HEAD)"
                // echo "Build Docker image ..."
                // echo "Build Docker image backend ..."
                echo "${DOCKER_ID}/${DOCKER_VM_BACKEND_IMAGE}:${GIT_COMMIT_HASH}"
                // sh "docker build ./backend -t ${DOCKER_ID}/${DOCKER_VM_BACKEND_IMAGE}:${GIT_COMMIT_HASH}"

                // echo "Build Docker image frontend ..."
                // echo "${DOCKER_ID}/${DOCKER_VM_FRONTEND_IMAGE}"
                // sh "docker build ./frontend -t ${DOCKER_ID}/${DOCKER_VM_FRONTEND_IMAGE}:${GIT_COMMIT_HASH}"
            }
        }

        // stage('Deploy'){
        //     steps {
        //         GIT_COMMIT_HASH = sh "(git rev-parse HEAD)"
        //         echo "Push Docker images into Docker Hub ..."
        //         sh "echo \"${env.DOCKER_PASSWORD}\" | docker login -u \"${env.DOCKER_ID}\" --password-stdin"
        //         sh "docker push ${DOCKER_ID}/${DOCKER_VM_BACKEND_IMAGE}:${GIT_COMMIT_HASH}"
        //         sh "docker push ${DOCKER_ID}/${DOCKER_VM_FRONTEND_IMAGE}:${GIT_COMMIT_HASH}"
        //     }
        // }
    }
}