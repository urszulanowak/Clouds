#!/bin/bash
pwd
ls

# set -e
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
python -m pip install --use-pep517 gunicorn

echo "######################################## 3 ########################################"
echo "Starting Flask backend..."
export PYTHONPATH=$PYTHONPATH:/opt/render/project/src/transport-management/backend
gunicorn -w 1 -b 0.0.0.0:5000 app:app

FLASK_PID=$!
echo "Flask backend running with PID $FLASK_PID"





echo "######################################## 4 ########################################"
cd transport-management
echo "transport management dir:"
ls
pwd
echo "######################################## 5 ########################################"
echo "Starting frontend..."
npm install
# npm audit fix --force
npm start --prefix frontend/ &
REACT_PID=$!
echo "React frontend running with PID $REACT_PID"

# echo "Press [CTRL+C] to stop both servers."
# trap "kill $FLASK_PID $REACT_PID" SIGINT
wait
