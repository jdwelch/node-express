run-db:
				mongod --dbpath ./data
run:
				npm install
				NODE_ENV=dev NODE_PORT=8080 MONGO_URL="mongodb://localhost:27017/node-express-db" pm2 start server.js --watch --no-daemon
compose:
				docker-compose kill
				docker-compose up
mini:
				kubectl config use-context minikube
				eval $(minikube docker-env)
				docker build -t node-express:v1 .
				kubectl create -f mongo-deployment.yaml
				kubectl create -f node-express-deployment.yaml
				minikube service node-express
stop-mini:
				kubectl delete -f node-express-deployment.yaml
				kubectl delete -f mongo-deployment.yaml