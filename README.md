# Basic Containerized Application Template

## Overview

This repository serves as a starting point for building containerized applications using Python Flask for the API, Kubernetes for container orchestration, and AWS CDK for infrastructure deployment.

## Contents

- [Introduction](#introduction)
- [Components](#components)
- [Setup](#setup)
- [Usage](#usage)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

## Introduction

This project provides a simple yet powerful template for containerized applications. It leverages the following technologies:

- **GitHub**: As the version control system and repository store.
- **Python Flask**: A lightweight and extensible web framework for building API applications.
- **Kubernetes (K8s)**: An open-source container orchestration platform for automating deployment, scaling, and management of containerized applications.
- **AWS CDK (Cloud Development Kit)**: An open-source software development framework to define cloud infrastructure in code and provision it through AWS CloudFormation.

## Components

The project consists of the following key components:

1. **Flask App**: The Python Flask application serves as the API for your containerized application. Customize it to fit your specific requirements by adding endpoints and business logic. This is expanded with a MongoDB backend for data storage. 

2. **Dockerfile**: This file contains instructions to build a Docker image for your Flask application. Docker enables containerization, making your application portable and scalable.

3. **Kubernetes Manifests**: The `orchestration/` directory contains Kubernetes YAML manifests for deploying and managing your containerized application. Customize these files based on your deployment needs.

4. **AWS CDK or Terraform**: The `infrastructure/` directory includes AWS CDK code written in Python; or Terraform. This code defines the infrastructure required to deploy your containerized application on AWS.

## Setup

1. **Clone Repository**: Clone this repository to your local machine using the following command:

    ```bash
    git clone https://github.com/ImranAdan/api-docker-k8s-infra-template
    ```

2. **Install Dependencies**: Ensure you have Python, Docker, Kubernetes, and AWS CDK or Terraform installed on your local machine. Each project contains README files to get this started. 

3. **Customize Flask App**: Modify the Flask app in the `app/` directory to meet your specific API requirements.

4. **Deploy Flask App to the Cloud**: The final aspect would be to deploy to a given cloud provider, in this instance it is AWS. The specific method depends on the approach chosen. 

## Usage

To run the application locally, follow these steps:

1. Build the Docker image:

This project has been built on an M2 machine and therefore you will need to specify the default platform to support ARM chips. 

```bash 
docker image build --platform linux/amd64 --tag api-docker-k8s-infra-template .
```

2. Run the Docker container:

    ```bash
    docker container run -d -p 8080:8080 api-docker-k8s-infra-template
    ```

Visit `http://localhost:8080` in your browser to access the Flask app.

## Deployment

Deploying the application to Kubernetes and AWS involves the following steps:

1. Customize Kubernetes manifests in the `orchestration/` directory.

2. Update infrastructure `infrastructure/` directory according to your infrastructure requirements.

3. Deploy the application using Kubernetes and AWS.

## Contributing

If you would like to contribute to this project, please follow the guidelines in the [CONTRIBUTING.md](CONTRIBUTING.md) file.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
