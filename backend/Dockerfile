FROM php:8.3-apache
RUN docker-php-ext-install pdo_mysql && a2enmod rewrite \
    && sed -i 's!/var/www/html!/var/www/html/public!g' /etc/apache2/sites-available/000-default.conf \
    && printf '<Directory /var/www/html/public>\nAllowOverride All\nRequire all granted\n</Directory>\n' > /etc/apache2/conf-available/tnt-cms.conf \
    && a2enconf tnt-cms
RUN apt-get update && apt-get install -y --no-install-recommends libonig-dev \
    && docker-php-ext-install mbstring && rm -rf /var/lib/apt/lists/*
WORKDIR /var/www/html
COPY config/php.ini /usr/local/etc/php/conf.d/tnt-cms.ini
COPY . .
RUN mkdir -p storage/sessions && chown -R www-data:www-data storage
EXPOSE 80
