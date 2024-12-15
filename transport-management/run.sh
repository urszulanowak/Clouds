#!/bin/bash
pwd
ls
# /opt/render/project/src/

python3 -m venv venv
source venv/bin/activate
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
