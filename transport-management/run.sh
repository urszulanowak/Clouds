#!/bin/bash
pwd
ls
# /opt/render/project/src/
python3 --version
python3 -m venv venv
source venv/bin/activate
python -m pip install wheel
python -m pip install --upgrade pip setuptools wheel
python -m pip install --upgrade pip
python -m pip install --use-pep517
python -m pip install flask
python -m pip install -r transport-management/backend/requirements.txt

echo "Starting backend..."
python transport-management/backend/app.py &

cd transport-management
echo "transport management dir:"
ls
pwd
echo "Starting frontend..."
npm start &

wait
