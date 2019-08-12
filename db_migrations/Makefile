.PHONY: run-migrate

run-migrate:
	@docker build -t honeycomb-migrate:v0 .
	@docker run -it --network=honeycomb_default -e POSTGRES_PASSWORD=iamaninsecurepassword -e POSTGRES_USER=honeycomb_user -e POSTGRES_DB=honeycomb -e PGHOST=postgres honeycomb-migrate:v0
