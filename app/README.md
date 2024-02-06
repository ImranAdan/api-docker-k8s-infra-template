# Build 

Create a virtual environment and install the necessary pip requirements. 

```bash
cd api-docker-k8s-infra-template/app
python -m virtualenv .venv
source .venv/bin/activate.fish # remove the .fish prefix as this only applies to fish shell.
pip install -r requirement.txt 
```

# Run

Run the application

```bash
python main.py
```