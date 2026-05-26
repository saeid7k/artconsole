#!/bin/bash
set -e

mkdir -p \
    /var/www/html/storage/logs \
    /var/www/html/storage/framework/cache/data \
    /var/www/html/storage/framework/sessions \
    /var/www/html/storage/framework/views \
    /var/www/html/storage/app/public \
    /var/www/html/public/drive \
    /var/www/html/bootstrap/cache

chmod -R 777 /var/www/html/storage /var/www/html/bootstrap/cache /var/www/html/public/drive

if [ "${APP_ENV}" = "production" ]; then
    chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache /var/www/html/public/drive
fi

# Skip app bootstrap for worker containers (queue, scheduler)
if [ "${SKIP_BOOTSTRAP:-false}" = "true" ]; then
    exec "$@"
fi

if [ ! -f /var/www/html/vendor/autoload.php ]; then
    echo "[entrypoint] Installing Composer dependencies..."
    composer install --no-interaction --prefer-dist
fi

if [ -z "${APP_KEY}" ] || [ "${APP_KEY}" = "base64:" ]; then
    echo "[entrypoint] Generating application key..."
    php artisan key:generate --ansi
fi

if [ "${APP_ENV}" = "production" ]; then
    echo "[entrypoint] Running production bootstrap..."
    php artisan migrate --force --no-interaction
    php artisan config:cache
    php artisan route:cache
    php artisan view:cache
    # No storage:link — storage/app/public is served directly by nginx via a shared volume
fi

exec "$@"
