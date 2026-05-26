# ================================================================
# Stage 1: Build frontend assets
# ================================================================
FROM node:20-alpine AS frontend

WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

COPY . .
RUN npm run build


# ================================================================
# Stage 2: PHP base image (shared between dev and production)
# ================================================================
FROM php:8.3-fpm-alpine AS base

LABEL maintainer="ArtConsole"

# Install system dependencies
RUN apk add --no-cache \
    bash \
    git \
    curl \
    zip \
    unzip \
    libpng-dev \
    libjpeg-turbo-dev \
    libwebp-dev \
    libzip-dev \
    icu-dev \
    oniguruma-dev \
    libxml2-dev \
    freetype-dev \
    imagemagick-dev \
    imagemagick \
    pkgconf \
    autoconf \
    g++ \
    make \
    chromium \
    nss \
    freetype \
    harfbuzz \
    ca-certificates \
    ttf-freefont \
    nodejs \
    npm \
    supervisor

# Configure and install PHP extensions
RUN docker-php-ext-configure gd --with-jpeg --with-webp --with-freetype \
    && docker-php-ext-install \
        pdo_mysql \
        mbstring \
        exif \
        pcntl \
        bcmath \
        gd \
        zip \
        intl \
        opcache \
        dom \
    && pecl install redis imagick-3.7.0 \
    && docker-php-ext-enable redis imagick \
    && rm -rf /tmp/pear

# Tell Puppeteer/Browsershot to use the system-installed Chromium
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser \
    CHROME_PATH=/usr/bin/chromium-browser

# Install Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html

# Copy PHP configuration files
COPY docker/php/php.ini /usr/local/etc/php/conf.d/99-custom.ini
COPY docker/php/opcache.ini /usr/local/etc/php/conf.d/98-opcache.ini

# Copy and set up entrypoint
COPY docker/entrypoint.sh /usr/local/bin/docker-entrypoint
RUN chmod +x /usr/local/bin/docker-entrypoint

EXPOSE 9000

ENTRYPOINT ["docker-entrypoint"]
CMD ["php-fpm"]


# ================================================================
# Stage 3: Production image (bakes in all code and compiled assets)
# ================================================================
FROM base AS production

# Install PHP dependencies (no dev, optimized autoloader)
COPY composer.json composer.lock ./
RUN composer install \
    --no-dev \
    --optimize-autoloader \
    --no-scripts \
    --no-interaction \
    --prefer-dist

# Install Node dependencies (puppeteer needed at runtime by Browsershot)
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

# Copy full application source
COPY . .

# Overlay compiled frontend assets from Stage 1
COPY --from=frontend /app/public/build ./public/build

# Enable OPcache for production
COPY docker/php/opcache.prod.ini /usr/local/etc/php/conf.d/98-opcache.ini

# Run post-autoload scripts
RUN composer run-script post-autoload-dump --no-interaction

# Harden permissions
RUN chown -R www-data:www-data /var/www/html \
    && chmod -R 775 storage bootstrap/cache
