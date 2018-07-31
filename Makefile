ifndef GCP_PROJECT
$(error GCP_PROJECT is not set)
endif

CONTAINER_NAME = node-express
CLUSTER_NAME = cluster-express
ZONE = europe-west1-b

bootstrap:
	gcloud beta container --project "$(GCP_PROJECT)" \
	clusters create "$(CLUSTER_NAME)" --zone "$(ZONE)" \
	--username "admin" --cluster-version "1.10.5-gke.3" --machine-type "g1-small" \
	--image-type "COS" --disk-type "pd-standard" --disk-size "100" --scopes "https://www.googleapis.com/auth/devstorage.read_only","https://www.googleapis.com/auth/logging.write","https://www.googleapis.com/auth/monitoring","https://www.googleapis.com/auth/servicecontrol","https://www.googleapis.com/auth/service.management.readonly","https://www.googleapis.com/auth/trace.append" \
	--num-nodes "3" --enable-cloud-logging --enable-cloud-monitoring --network "default" \
	--subnetwork "default" --addons HorizontalPodAutoscaling,HttpLoadBalancing --no-enable-autoupgrade \
	--enable-autorepair

run-db:
	mongod --dbpath ./data

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

deploy:
	kubectl create -f mongo-deployment.yaml
	kubectl create -f node-express-deployment.yaml

stop-deploy:
	kubectl delete -f node-express-deployment.yaml
	kubectl delete -f mongo-deployment.yaml

destroy:
	gcloud container clusters delete $(CLUSTER_NAME) --zone $(ZONE)

show:
	@echo `kubectl get service node-express -o jsonpath={.status.loadBalancer.ingress[0].ip}`:8080