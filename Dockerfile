FROM php:8.1-apache

# Устанавливаем системные зависимости
RUN apt-get update && apt-get install -y \
    git \
    curl \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    zip \
    unzip \
    && docker-php-ext-install pdo_mysql mbstring exif pcntl bcmath gd

# Включаем mod_rewrite для Apache
RUN a2enmod rewrite

# Копируем файлы приложения
COPY . /var/www/html/

# Устанавливаем права
RUN chown -R www-data:www-data /var/www/html \
    && chmod -R 755 /var/www/html

# Создаем папку для сессий
RUN mkdir -p /var/lib/php/sessions \
    && chown -R www-data:www-data /var/lib/php/sessions

# Настраиваем виртуальный хост
COPY docker/apache.conf /etc/apache2/sites-available/000-default.conf

# Указываем рабочую директорию
WORKDIR /var/www/html

# Открываем порт
EXPOSE 80

CMD ["apache2-foreground"]