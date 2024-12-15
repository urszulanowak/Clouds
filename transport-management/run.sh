#!/bin/bash
pwd
ls
# /opt/render/project/src/
echo "Starting backend..."
python3 transport-management/backend/app.py &

cd transport-management
echo "transport management dir:"
ls
pwd
echo "Starting frontend..."
npm start &

wait
