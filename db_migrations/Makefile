.PHONY: build-docker run-migrate docker-push

version := v2021-03-31-18-53-34 #v$(shell date -u "+%Y-%m-%d-%H-%M-%S")

build-docker:
	@docker build -t wildflowerschools/honeycomb-migrate:${version} .

run-migrate: build-docker
	@docker run -it --network=sensors_honeycomb_api_default -e POSTGRES_PASSWORD=iamaninsecurepassword -e POSTGRES_USER=honeycomb_user -e POSTGRES_DB=honeycomb -e PGHOST=postgres wildflowerschools/honeycomb-migrate:${version}

docker-push: build-docker
	@echo 'Pushing wildflowerschools/honeycomb-migrate:${version} to Docker Hub'
    @docker push wildflowerschools/honeycomb-migrate:${version}
