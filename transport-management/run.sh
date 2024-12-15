#!/bin/bash
pwd
ls
# /opt/render/project/src/
python3 --version
python3 -m venv venv
source venv/bin/activate
python3 -m pip install wheel
python3 -m pip install --upgrade pip setuptools wheel
-m pip install --upgrade pip
pip install flask
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
