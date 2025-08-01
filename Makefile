.PHONY: help install dev build start lint clean up down logs restart status shell db-migrate db-deploy db-reset db-seed db-studio redis-cli test

# Default target
help: ## Show this help message
	@echo 'Usage: make [target]'
	@echo ''
	@echo 'Targets:'
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}' $(MAKEFILE_LIST)

# Development commands
install: ## Install dependencies
	npm install

dev: ## Start development server locally
	npm run dev

build: ## Build the application
	npm run build

start: ## Start production server locally  
	npm run start

lint: ## Run ESLint
	npm run lint

test: ## Run tests (if available)
	npm test

# Docker commands
up: ## Start all Docker services
	docker-compose up -d

down: ## Stop all Docker services
	docker-compose down

build-docker: ## Build Docker images
	docker-compose build

restart: ## Restart all Docker services
	docker-compose restart

logs: ## Show logs for all services
	docker-compose logs -f

logs-app: ## Show logs for app service only
	docker-compose logs -f app

logs-db: ## Show logs for postgres service only
	docker-compose logs -f postgres

logs-redis: ## Show logs for redis service only
	docker-compose logs -f redis

status: ## Show status of all services
	docker-compose ps

# Shell access
shell: ## Access app container shell
	docker-compose exec app sh

shell-db: ## Access postgres container shell
	docker-compose exec postgres psql -U postgres -d trpc_oauth_db

redis-cli: ## Access Redis CLI
	docker-compose exec redis redis-cli -a redis_password

# Database commands
db-migrate: ## Run Prisma migrations
	npm run migrate

db-migrate-new: ## Create new migration (usage: make db-migrate-new name=migration_name)
	npm run migrate:new $(name)

db-deploy: ## Deploy migrations to production
	npm run migrate:deploy

db-reset: ## Reset database and run migrations
	npm run migrate:reset

db-seed: ## Seed the database
	npx prisma db seed

db-studio: ## Open Prisma Studio
	npx prisma studio

db-generate: ## Generate Prisma client
	npx prisma generate

# Docker database commands
docker-db-migrate: ## Run migrations in Docker container
	docker-compose exec app npm run migrate

docker-db-deploy: ## Deploy migrations in Docker container
	docker-compose exec app npm run migrate:deploy

docker-db-reset: ## Reset database in Docker container
	docker-compose exec app npm run migrate:reset

docker-db-seed: ## Seed database in Docker container
	docker-compose exec app npx prisma db seed

docker-db-studio: ## Open Prisma Studio in Docker container
	docker-compose exec app npx prisma studio

docker-db-generate: ## Generate Prisma client in Docker container
	docker-compose exec app npx prisma generate

# Cleanup commands
clean: ## Remove all containers, volumes, and images
	docker-compose down -v --rmi all
	docker system prune -f

clean-volumes: ## Remove only volumes
	docker-compose down -v

clean-images: ## Remove Docker images
	docker-compose down --rmi all

# Environment setup
setup: ## Initial project setup
	@echo "Setting up the project..."
	@if [ ! -f .env.local ]; then cp .env.example .env.local; echo ".env.local created from .env.example"; fi
	npm install
	docker-compose up -d postgres redis
	@echo "Waiting for database to be ready..."
	@sleep 10
	npm run migrate
	@echo "Setup complete!"

# Development workflow
dev-full: ## Full development setup (Docker + local dev)
	docker-compose up -d postgres redis
	@echo "Waiting for services to be ready..."
	@sleep 10
	npm run dev

# Production commands
prod-build: ## Build for production
	docker-compose -f docker-compose.yml build

prod-up: ## Start production environment
	docker-compose -f docker-compose.yml up -d

prod-down: ## Stop production environment
	docker-compose -f docker-compose.yml down