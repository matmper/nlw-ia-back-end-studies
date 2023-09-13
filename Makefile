include .env

CONTAINER=nfw-ia-node-18

build: kill
	docker-compose up --build -d

up: down
	docker-compose up --no-build -d
	make migrate-deploy

down:
	docker-compose down || true

kill:
	docker-compose kill || true

tty:
	docker exec -it $(CONTAINER) /bin/sh

code-lint:
	docker exec -it $(CONTAINER) yarn run format
	docker exec -it $(CONTAINER) yarn run lint

yarn-add:
	docker exec -it $(CONTAINER) yarn add $(package)

yarn-add-dev:
	docker exec -it $(CONTAINER) yarn add $(package) -D

migrate-deploy:
	docker exec -it $(CONTAINER) yarn prisma migrate deploy

migrate-dev:
	docker exec -it $(CONTAINER) yarn prisma migrate dev