#!/bin/bash
pwd
ls
# /opt/render/project/src/
python3 --version
python3 -m venv venv
source venv/bin/activate
python --version
python -m pip install --use-pep517 wheel
python -m pip install --use-pep517 neo4j
python -m pip install --use-pep517 Flask
python -m pip install --use-pep517 flask_cors
python -m pip install --use-pep517 dotenv


echo "Starting backend..."
python transport-management/backend/app.py &

cd transport-management
echo "transport management dir:"
ls
pwd
echo "Starting frontend..."
npm start &

wait
