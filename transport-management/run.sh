#!/bin/bash

echo "Starting backend..."
python3 backend/app.py &

echo "Starting frontend..."
npm start &

wait
