#!/bin/bash

# Variáveis
PRIVATE_KEY_PATH="/home/diogo/.ssh/PRIVATE_KEY.pem"
REMOTE_USER="diogo"
REMOTE_HOST="ip do host"
REMOTE_PATH="/var/www/html/projeto"
LOCAL_PATH="/callauth/dist"
SSH_PORT=2220

BRANCH=$1

ssh -i "$PRIVATE_KEY_PATH" -p $SSH_PORT $REMOTE_USER@$REMOTE_HOST "
  sudo git config --global --add safe.directory /projeto &&
  cd /projeto &&
  sudo git fetch origin &&
  sudo git checkout $BRANCH || git checkout -b $BRANCH &&
  sudo git pull origin $BRANCH &&
  sudo mkdir -p /var/www/html/projeto-dist/spa/ &&
  sudo rm -rf /var/www/html/projeto-dist/spa/ &&
  sudo rsync -av /projeto/dist/spa/ /var/www/html/projeto-dist/spa/ &&
  sudo chown -R diogo:www-data /var/www/html/projeto-dist/
"
