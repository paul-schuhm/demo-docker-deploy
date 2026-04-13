.PHONY: config run-dev run-prod rebuild build-prod
config:
	@echo "Config dev :"
	docker compose -f compose.yaml -f compose.dev.yaml config
	@echo "Config prod :"
	docker compose -f compose.yaml -f compose.prod.yaml --env-file .env.prod config
run-dev:
	mkdir -p db-data
	docker compose -f compose.yaml -f compose.dev.yaml up --watch
run-prod:
	docker compose -f compose.yaml -f compose.prod.yaml --env-file .env.prod up -d --build
rebuild:
	docker compose -f compose.yaml -f compose.dev.yaml build api
build-prod:
	docker build --target production --tag api .

