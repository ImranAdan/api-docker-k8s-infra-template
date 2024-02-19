from aws_cdk import (
    Stack,
    aws_iam as iam,
    aws_ec2 as ec2,
    aws_ecr as ecr,
    aws_ecr_assets as ecr_assets,
    aws_eks as eks
)
from constructs import Construct

class InfrastructureStack(Stack):

    def __init__(self, scope: Construct, construct_id: str, **kwargs) -> None:
        super().__init__(scope, construct_id, **kwargs)

        # Create a default VPC
        vpc = ec2.Vpc(self, "EKSVpc", max_azs=2)

    #     # Create an ECR repository
        ecr_repository = ecr.Repository(self, "api-docker-k8s-infra-template-ecr",
                                        repository_name="api-docker-k8s-infra-template")

    #     # Define the path to your Dockerfile
        dockerfile_path = ".."

    #     # Build Docker image from Dockerfile
        docker_image = ecr_assets.DockerImageAsset(self, "api-docker-k8s-infra-template-image",
                                                    directory=dockerfile_path, 
                                                    exclude=['cdk.out']
                                                    )
        
        # Grant permissions to push the Docker image to the ECR repository
        docker_image.repository.grant_pull_push(iam.ArnPrincipal("*"))

        # Create EKS Cluster
        cluster = eks.Cluster(self, "EKSCluster",
            cluster_name="EKSCluster",
            version=eks.KubernetesVersion.V1_28,
            default_capacity=1,
            vpc=vpc
        )
        