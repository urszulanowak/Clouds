#!/bin/bash
pwd
ls
# /opt/render/project/src/
echo "######################################## 1 ########################################"
python3 --version
python3 -m venv venv
source venv/bin/activate
python --version
echo "######################################## 2 ########################################"
python -m pip install --use-pep517 wheel
python -m pip install --use-pep517 neo4j
python -m pip install --use-pep517 Flask
python -m pip install --use-pep517 flask_cors
python -m pip install --use-pep517 python-dotenv

echo "######################################## 3 ########################################"
echo "Starting backend..."
python transport-management/backend/app.py &

echo "######################################## 4 ########################################"
cd transport-management
echo "transport management dir:"
ls
pwd
echo "######################################## 5 ########################################"
echo "Starting frontend..."
npm start &

wait
