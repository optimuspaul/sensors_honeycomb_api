default: coverage

run:
	docker-compose up -d

coverage: run
	sleep 5
	docker-compose run honeycomb-service /app/node_modules/.bin/nyc --reporter=html npm test
