from aws_cdk import (
    Stack,
    aws_ec2 as ec2,
    aws_eks as eks,
    App,
)
from constructs import Construct

class InfrastructureStack(Stack):

    def __init__(self, scope: Construct, construct_id: str, **kwargs) -> None:
        super().__init__(scope, construct_id, **kwargs)

        # Create a default VPC
        vpc = ec2.Vpc(self, "EKSVpc", max_azs=2)

        # Create EKS Cluster
        cluster = eks.Cluster(self, "EKSCluster",
            cluster_name="EKSCluster",
            version=eks.KubernetesVersion.V1_28,
            default_capacity=2,
            vpc=vpc
        )

        