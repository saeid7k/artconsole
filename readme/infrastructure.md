# Server Infrastructure & Architecture Documentation

## Server Specifications
- **Operating System:** Ubuntu 24.04.4 LTS (Noble Numbat)
- **Kernel Version:** 6.8.0-71-generic #71-Ubuntu SMP PREEMPT_DYNAMIC
- **Architecture:** x86_64
- **CPU Cores:** 2
- **Memory (RAM):** ~4 GB (3916 MB total)
- **Swap Space:** ~4 GB (4095 MB)
- **Storage:** 
  - Main Partition (`/dev/vda1`): 77G Total, 69G Used, 7.8G Available (90% capacity)
- **PHP Version (Host):** PHP 8.3.6

## Hosted Applications and Services

The server utilizes Docker and Docker Compose for containerized application deployments.

### Web Server & Reverse Proxy
- **Traefik (v3):** Acts as the primary reverse proxy and load balancer, handling external HTTP (80) and HTTPS (443) traffic and routing it to the appropriate containers. 

### Web Applications
1. **ArtConsole App (Laravel)** 
   - Uses `ghcr.io/saeid7k/artconsole/artconsole-app:latest`
   - Services include:
     - Main App Container (`artconsole-app-1`)
     - Queue Worker (`artconsole-queue-1`)
     - Scheduler (`artconsole-scheduler-1`)
     - Pulse Monitor (`artconsole-pulse-1`)
   - Uses a dedicated Nginx container (`artconsole-nginx-1`, using `ghcr.io/saeid7k/artconsole/artconsole-nginx:latest`) to serve web requests to the App container.

2. **ArtConsole Landing Page**
   - Uses `ghcr.io/saeid7k/artconsole-landing/artconsole-landing:latest`
   - Expresses internally on port 3000 (`artconsole-landing`).

### Databases and External Services
- **Database Server:** Hosted directly on the host machine (outside of Docker).
- **Redis:** `redis:7-alpine` provides caching and queue management for the Laravel app (`artconsole-redis-1`). 
- **phpMyAdmin:** Used for database management (`phpmyadmin-phpmyadmin-1`).

### Monitoring
- **Netdata:** `netdata/netdata:stable` is employed for real-time performance and health monitoring (`netdata`).
