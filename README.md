# NextJs tRPC

A full-stack TypeScript monolith built with Next.js, tRPC, Prisma, and OAuth authentication. Features Docker containerization with PostgreSQL and Redis for a complete development environment.

## 🚀 Tech Stack

- **Frontend**: Next.js 15, React 19, TailwindCSS
- **Backend**: tRPC, Prisma ORM
- **Database**: PostgreSQL
- **Cache**: Redis
- **Auth**: OAuth + JWT with bcryptjs
- **DevOps**: Docker & Docker Compose
- **Type Safety**: TypeScript, Zod validation

## 📋 Prerequisites

- Node.js 18+ 
- Docker & Docker Compose
- npm/yarn/pnpm

## 🛠 Quick Start

### Initial Setup
```bash
# Complete project setup (recommended)
make setup
```

This command will:
- Copy `.env.example` to `.env.local`
- Install npm dependencies
- Start PostgreSQL and Redis containers
- Run database migrations

### Development

```bash
# Start development with Docker services
make dev-full

# Or start services separately
make up          # Start Docker services (PostgreSQL + Redis)
make dev         # Start Next.js development server locally
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## 📖 Available Commands

Run `make help` to see all available commands, or refer to the sections below:

### Development Commands
```bash
make install         # Install dependencies
make dev            # Start Next.js development server
make dev-full       # Start Docker services + local dev server
make build          # Build the application
make start          # Start production server locally
make lint           # Run ESLint
make test           # Run tests
```

### Docker Commands
```bash
make up             # Start all Docker services
make down           # Stop all Docker services
make build-docker   # Build Docker images
make restart        # Restart all services
make logs           # Show logs for all services
make logs-app       # Show app logs only
make logs-db        # Show PostgreSQL logs only
make logs-redis     # Show Redis logs only
make status         # Show service status
```

### Database Commands

**Local Development:**
```bash
make db-migrate              # Run Prisma migrations
make db-migrate-new name=... # Create new migration
make db-deploy              # Deploy migrations to production
make db-reset               # Reset database and migrations
make db-seed                # Seed the database
make db-studio              # Open Prisma Studio
make db-generate            # Generate Prisma client
```

**Docker Environment:**
```bash
make docker-db-migrate      # Run migrations in Docker
make docker-db-deploy       # Deploy migrations in Docker
make docker-db-reset        # Reset database in Docker
make docker-db-seed         # Seed database in Docker
make docker-db-studio       # Open Prisma Studio in Docker
make docker-db-generate     # Generate Prisma client in Docker
```

### Shell Access
```bash
make shell          # Access app container shell
make shell-db       # Access PostgreSQL shell
make redis-cli      # Access Redis CLI
```

### Cleanup Commands
```bash
make clean          # Remove all containers, volumes, and images
make clean-volumes  # Remove only volumes
make clean-images   # Remove Docker images
```

### Production Commands
```bash
make prod-build     # Build for production
make prod-up        # Start production environment
make prod-down      # Stop production environment
```

## 🔧 Environment Configuration

1. Copy the environment template:
   ```bash
   cp .env.example .env.local
   ```

2. Update the variables in `.env.local`:
   ```env
   DATABASE_URL="postgresql://postgres:postgres@localhost:5432/trpc_oauth_db"
   REDIS_URL="redis://:redis_password@localhost:6379"
   NEXTAUTH_SECRET="your-nextauth-secret-key"
   NEXTAUTH_URL="http://localhost:3000"
   JWT_SECRET="your-jwt-secret-key"
   
   # Add your OAuth provider credentials
   GOOGLE_CLIENT_ID="your-google-client-id"
   GOOGLE_CLIENT_SECRET="your-google-client-secret"
   GITHUB_CLIENT_ID="your-github-client-id"  
   GITHUB_CLIENT_SECRET="your-github-client-secret"
   ```

## 🐳 Docker Services

The application uses Docker Compose with the following services:

- **PostgreSQL**: Database on port 5432
- **Redis**: Cache/session store on port 6379  
- **App**: Next.js application on port 3000

### Service Health Checks
All services include health checks to ensure proper startup order and reliability.

## 📁 Project Structure

```
├── src/
│   ├── app/              # Next.js App Router
│   ├── components/       # React components
│   ├── server/          # tRPC server logic
│   └── lib/             # Utilities and configurations
├── prisma/              # Database schema and migrations
├── public/              # Static assets
├── docker-compose.yml   # Docker services configuration
├── Dockerfile          # Application container
├── Makefile            # Development commands
└── README.md           # This file
```

## 🚀 Deployment

### Docker Production
```bash
make prod-build
make prod-up
```

### Vercel (Alternative)
The application can also be deployed on [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme).

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests: `make test`
5. Run linting: `make lint`
6. Submit a pull request

## 📚 Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [tRPC Documentation](https://trpc.io/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Docker Documentation](https://docs.docker.com)
