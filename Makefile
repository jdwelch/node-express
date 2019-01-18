ifndef GCP_PROJECT
$(error GCP_PROJECT is not set)
endif

CONTAINER_NAME = node-express

run-db:
	mongod --dbpath /tmp/data

run:
	npm install
	NODE_ENV=dev NODE_PORT=8080 MONGO_URL="mongodb://localhost:27017/node-express-db" pm2 start server.js --watch --no-daemon

build:
	@echo "🔘 Building '$(CONTAINER_NAME)' container with Cloud Build..."
	gcloud builds submit --tag gcr.io/$(GCP_PROJECT)/$(CONTAINER_NAME):latest .

build-docker:
	@echo "🔘 Building '$(CONTAINER_NAME)' container with Docker..."
	docker build -t $(CONTAINER_NAME) .
	@echo "🔘 Tagging '$(CONTAINER_NAME)' container..."
	docker tag $(CONTAINER_NAME) gcr.io/$(GCP_PROJECT)/$(CONTAINER_NAME):latest
	@echo "🔘 Pushing '$(CONTAINER_NAME)' container to GCP Container Registry..."
	docker push gcr.io/$(GCP_PROJECT)/$(CONTAINER_NAME):latest

show:
	@echo "http://`kubectl get service node-express -o jsonpath={.status.loadBalancer.ingress[0].ip}`:8080"

data:
	bash tasks/fakedata.sh `kubectl get service node-express -o jsonpath={.status.loadBalancer.ingress[0].ip}`:8080
