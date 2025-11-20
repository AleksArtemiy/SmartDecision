FROM php:8.1-apache

# Устанавливаем системные зависимости
RUN apt-get update && apt-get install -y \
    && docker-php-ext-install pdo_mysql

# Включаем mod_rewrite для Apache
RUN a2enmod rewrite

# Копируем все файлы приложения
COPY . /var/www/html/

# Устанавливаем правильные права
RUN chown -R www-data:www-data /var/www/html \
    && chmod -R 755 /var/www/html \
    && chmod 644 /var/www/html/*.php

# Настраиваем Apache для обработки PHP файлов
RUN echo "DirectoryIndex index.php index.html" > /etc/apache2/conf-available/directory-index.conf \
    && a2enconf directory-index

WORKDIR /var/www/html

EXPOSE 80

CMD ["apache2-foreground"]