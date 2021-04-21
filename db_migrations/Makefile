.PHONY: build-docker run-migrate docker-push

version := v1 #v$(shell date -u "+%Y-%m-%d-%H-%M-%S")

build-docker:
	@docker build -t wildflowerschools/honeycomb-migrate:${version} .
	@docker build -t wildflowerschools/honeycomb-migrate:imu-partitioner-${version} --file Dockerfile.partition-management .

run-migrate: build-docker
	@docker run -it --network=sensors_honeycomb_api_default -e POSTGRES_PASSWORD=iamaninsecurepassword -e POSTGRES_USER=honeycomb_user -e POSTGRES_DB=honeycomb -e PGHOST=postgres wildflowerschools/honeycomb-migrate:${version}

docker-push-migrate: build-docker
	@echo 'Pushing wildflowerschools/honeycomb-migrate:${version} to Docker Hub'
    @docker push wildflowerschools/honeycomb-migrate:${version}

docker-push-imu-partitioner: build-docker
	@echo 'Pushing wildflowerschools/honeycomb-migrate:imu-partitioner-${version} to Docker Hub'
    @docker push wildflowerschools/honeycomb-migrate:imu-partitioner-${version}