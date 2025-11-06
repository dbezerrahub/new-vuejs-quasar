#!/bin/bash

# Variáveis
PRIVATE_KEY_PATH="/home/diogo/.ssh/DEV_DIOGO_PRIVATE_KEY.pem"
REMOTE_USER="diogo"
REMOTE_HOST="54.88.250.35"
REMOTE_PATH="/var/www/html/paynbox-dist"
LOCAL_PATH="/paynbox/dist"
SSH_PORT=2220

BRANCH=$1

ssh -i "$PRIVATE_KEY_PATH" -p $SSH_PORT $REMOTE_USER@$REMOTE_HOST "
  sudo git config --global --add safe.directory /paynbox &&
  cd /paynbox &&
  sudo git fetch origin &&
  sudo git checkout $BRANCH || git checkout -b $BRANCH &&
  sudo git pull origin $BRANCH &&
  sudo mkdir -p /var/www/html/paynbox-dist/spa/ &&
  sudo rm -rf /var/www/html/paynbox-dist/spa/ &&
  sudo rsync -av /paynbox/dist/spa/ /var/www/html/paynbox-dist/spa/ &&
  sudo chown -R diogo:www-data /var/www/html/paynbox-dist/
"
