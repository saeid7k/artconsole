.PHONY: help up down build restart logs shell artisan migrate fresh seed composer npm prod-build prod-up prod-down prod-deploy prod-setup push-env ssl-init ssl-renew

help:
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'

up: ## Start all local containers
	docker compose up -d

down: ## Stop all local containers
	docker compose down

build: ## Rebuild local images (no cache)
	docker compose build --no-cache

restart: ## Restart a service (make restart s=app)
	docker compose restart $(s)

logs: ## Tail logs (make logs s=app)
	docker compose logs -f $(s)

shell: ## Open bash in app container
	docker compose exec app bash

artisan: ## Run artisan command (make artisan cmd="route:list")
	docker compose exec app php artisan $(cmd)

migrate: ## Run database migrations
	docker compose exec app php artisan migrate

fresh: ## Fresh migration with seeders
	docker compose exec app php artisan migrate:fresh --seed

seed: ## Run database seeders
	docker compose exec app php artisan db:seed

composer: ## Run composer command (make composer cmd="require vendor/pkg")
	docker compose exec app composer $(cmd)

npm: ## Run yarn command in vite container (make npm cmd="add pkg")
	docker compose exec vite yarn $(cmd)

prod-build: ## Build the production Docker image
	docker compose -f docker-compose.prod.yml --env-file .env.production build

prod-up: ## Start production stack
	docker compose -f docker-compose.prod.yml --env-file .env.production up -d

prod-down: ## Stop production stack
	docker compose -f docker-compose.prod.yml --env-file .env.production down

prod-deploy: ## Build image first, then swap containers (~5s downtime)
	docker compose -f docker-compose.prod.yml --env-file .env.production build app nginx
	docker compose -f docker-compose.prod.yml --env-file .env.production up -d --no-build --remove-orphans
	docker image prune -f

prod-setup: ## FIRST-TIME ONLY: reset DB, run migrations, seed (app:initial-setup)
	docker compose -f docker-compose.prod.yml --env-file .env.production exec app php artisan app:initial-setup

push-env: ## Upload .env.production to the droplet (make push-env SERVER=root@IP)
	scp .env.production $(SERVER):/var/www/artconsole/.env.production

ssl-init: ## Get initial SSL cert (make ssl-init APP_DOMAIN=example.com CERTBOT_EMAIL=you@example.com)
	docker compose -f docker-compose.prod.yml run --rm certbot \
		certonly --webroot -w /var/www/certbot \
		-d $(APP_DOMAIN) \
		--email $(CERTBOT_EMAIL) \
		--agree-tos --no-eff-email

ssl-renew: ## Force-renew SSL certificate
	docker compose -f docker-compose.prod.yml run --rm certbot renew --force-renewal
