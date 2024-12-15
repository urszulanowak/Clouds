#!/bin/bash

echo "Creating venv..."
python3 -m venv venv
source venv/bin/activate
echo "Installing prerequisites..."
python -m pip install -r backend/requirements.txt
echo " Starting backend..."
python backend/app.py &

echo "Starting frontend..."
npm install
npm start &

wait
