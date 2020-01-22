pipeline {
    agent any
    stages{
        stage('Init'){
            steps {
                echo "Testing ..."
            }
        }

        stage('Build'){
            steps {
                echo "Build Docker image ..."
            }
        }

        stage('Deploy'){
            steps {
                echo "Push Docker images into Docker Hub ..."
            }
        }
    }
}