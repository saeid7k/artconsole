# Deploy to DigitalOcean Droplet

## 1. Provision the Droplet
- [ ] Create a Droplet (Ubuntu 22.04 LTS, min 2 vCPU / 4 GB RAM)
- [ ] Add your SSH key during creation
- [ ] Point your domain's DNS `A` record to the Droplet's IP

## 2. Server Initial Setup
- [ ] SSH in: `ssh -i ~/.ssh/<your-local-key> root@<DROPLET_IP>`
- [ ] Update packages: `apt update && apt upgrade -y`
- [ ] Install Docker: `curl -fsSL https://get.docker.com | sh`
- [ ] Install Docker Compose plugin: `apt install docker-compose-plugin -y`
- [ ] Create app directory: `mkdir -p /var/www/artconsole`
- [ ] Create shared storage dir: `mkdir -p /var/www/artconsole/public/drive`

## 3. Set Up SSH Key (Repo Access + GitHub Actions Deploy)
One key pair serves both purposes: the droplet uses the private key to pull from GitHub, and GitHub Actions uses the same private key to SSH into the droplet.

- [ ] Generate the key on the droplet: `ssh-keygen -t ed25519 -C "artconsole-deploy" -f ~/.ssh/github_deploy`
- [ ] Add the public key to `authorized_keys` (allows GitHub Actions to SSH in): `cat ~/.ssh/github_deploy.pub >> ~/.ssh/authorized_keys`
- [ ] In the GitHub repo → **Settings → Deploy keys → Add deploy key**, paste `cat ~/.ssh/github_deploy.pub` (read-only is enough)
- [ ] Add to `~/.ssh/config` on the droplet so `git` uses it automatically:
  ```
  Host github.com
    IdentityFile ~/.ssh/github_deploy
  ```
- [ ] Test repo access: `ssh -T git@github.com`
- [ ] Copy the private key (`cat ~/.ssh/github_deploy`) and add it as GitHub Actions secret `PROD_SSH_KEY`
- [ ] Add `PROD_HOST`, `PROD_USER`, and optionally `PROD_PORT` as GitHub Actions secrets

## 4. Install MySQL on Host
- [ ] Install MySQL: `apt install mysql-server -y`
- [ ] Set root password and secure installation: `mysql_secure_installation`
- [ ] Create application DB user for production:
  ```sql
  CREATE DATABASE artconsole;
  CREATE USER 'artconsole'@'%' IDENTIFIED WITH mysql_native_password BY '<db-password>';
  GRANT ALL PRIVILEGES ON artconsole.* TO 'artconsole'@'%';
  FLUSH PRIVILEGES;
  ```
- [ ] Allow MySQL to listen on `0.0.0.0` in `/etc/mysql/mysql.conf.d/mysqld.cnf`: set `bind-address = 0.0.0.0`
- [ ] Restart MySQL: `systemctl restart mysql`
- [ ] Set in `.env.production`: `DB_USERNAME=artconsole`, `DB_PASSWORD=<db-password>`

## 5. Set Up Traefik (External Proxy)
- [ ] Create the external `proxy` network: `docker network create proxy`
- [ ] Deploy a Traefik container on the `proxy` network with Let's Encrypt (`certresolver=le`), `websecure` entrypoint (443), and HTTP→HTTPS redirect

## 6. Prepare Environment
- [ ] Fill in all blank values in `.env.production` before pushing:
  - `APP_KEY` — run `php artisan key:generate --show` locally
  - `ADMIN_DEFAULT_PASSWORD`
  - `DB_USERNAME=artconsole`, `DB_PASSWORD`
  - `REDIS_PASSWORD`
- [ ] Push the env file from your local machine:
  ```sh
  scp -i ~/.ssh/<your-local-key> .env.production root@<DROPLET_IP>:/var/www/artconsole/.env.production
  ```

## 7. Clone Repo & Build
- [ ] Clone the repo: `git clone git@github.com:saeid7k/artconsole.git /var/www/artconsole`
- [ ] Build the production image: `docker compose --env-file .env.production -f docker-compose.prod.yml build`
- [ ] Start the stack: `docker compose --env-file .env.production -f docker-compose.prod.yml up -d`

## 8. First-Time Database Setup
- [ ] Run initial setup (migrations + seeders):
  ```sh
  docker compose --env-file .env.production -f docker-compose.prod.yml exec app php artisan app:initial-setup
  ```
  > **Only run once** — resets and seeds the DB.

## 9. Ongoing Deploys
Handled automatically by the GitHub Actions workflow (`.github/workflows/deploy.yml`).  
Trigger manually from **Actions → Deploy to Production → Run workflow**.

## 10. Updating Environment Variables
If you make changes to your `.env.production` file, you must push it manually since it is not tracked by version control.

- [ ] Push the updated environment file from your local machine:
  ```sh
  scp -i ~/.ssh/<your-local-key> .env.production root@<DROPLET_IP>:/var/www/artconsole/.env.production
  ```
- [ ] SSH into the production server and restart the containers to apply the new variables:
  ```sh
  ssh -i ~/.ssh/<your-local-key> root@<DROPLET_IP>
  cd /var/www/artconsole
  docker compose --env-file .env.production -f docker-compose.prod.yml up -d
  ```
