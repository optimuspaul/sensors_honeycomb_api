.PHONY: build-docker run-migrate docker-push

now := $(shell date -u "+%Y-%m-%d-%H-%M-%S")
version := v$(now)

build-docker-migrate:
	@docker build -t wildflowerschools/honeycomb-migrate:${version} .

build-docker-imu-partitioner:
	@docker build -t wildflowerschools/honeycomb-migrate:imu-partitioner-${version} --file Dockerfile.partition-management .

run-migrate: build-docker-migrate
	@docker run -it --network=sensors_honeycomb_api_default -e POSTGRES_PASSWORD=iamaninsecurepassword -e POSTGRES_USER=honeycomb_user -e POSTGRES_DB=honeycomb -e PGHOST=postgres wildflowerschools/honeycomb-migrate:${version}

docker-push-migrate: build-docker-migrate
	@echo 'Pushing wildflowerschools/honeycomb-migrate:${version} to Docker Hub'
    @docker push wildflowerschools/honeycomb-migrate:${version}

docker-push-imu-partitioner: build-docker-imu-partitioner
	@echo 'Pushing wildflowerschools/honeycomb-migrate:imu-partitioner-${version} to Docker Hub'
    @docker push wildflowerschools/honeycomb-migrate:imu-partitioner-${version}