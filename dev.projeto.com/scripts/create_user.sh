# Define o arquivo de log
LOG_FILE="/usr/local/bin/create_user.log"

# Redireciona saída e erros para o log
exec > >(tee -a $LOG_FILE) 2>&1


USER_PUBLIC_KEY="ssh-rsa $(awk '/BEGIN SSH2 PUBLIC KEY/{flag=1; next} /END SSH2 PUBLIC KEY/{flag=0} flag' /usr/local/bin/USER_PUBLIC_KEY | awk '!/^Comment:/{print}')"
USER_PUBLIC_KEY=${USER_PUBLIC_KEY//$'\n'/}
USER_NAME="$USER_NAME"
PASSWORD="$USER_NAME"

# o diretório /var/run/sshd pode ser necessário para armazenar arquivos de soquete (socket files) 
# ou outros arquivos temporários utilizados pelo servidor SSH dentro do container.
mkdir -p /var/run/sshd

if ! id "$USER_NAME" >/dev/null 2>&1; then

echo "########## Criando usuário sudo ##########"
echo
useradd -s /bin/bash -d /home/$USER_NAME/ -m -G sudo $USER_NAME
echo "$USER_NAME:$PASSWORD" | chpasswd
echo "Usuário $USER_NAME criado com sucesso."
echo
echo

echo "########## Criando authorized_keys para o usuário $USER_NAME ##########"
mkdir /home/$USER_NAME/.ssh &&
echo "$USER_PUBLIC_KEY" > /home/$USER_NAME/.ssh/authorized_keys &&
chown $USER_NAME:$PASSWORD /home/$USER_NAME/.ssh
chmod 0700 /home/$USER_NAME/.ssh &&
chown $USER_NAME:$USER_NAME /home/$USER_NAME/.ssh/authorized_keys
chmod 0600 /home/$USER_NAME/.ssh/authorized_keys
echo "authorized_keys criado com sucesso."
echo
echo

echo "########## Retirando acesso via password ##########"
echo >> /etc/ssh/sshd_config
echo "Match User $USER_NAME" >> /etc/ssh/sshd_config
echo "PasswordAuthentication no" >> /etc/ssh/sshd_config
echo "AuthorizedKeysFile /home/$USER_NAME/.ssh/authorized_keys" >> /etc/ssh/sshd_config
echo "PubkeyAcceptedKeyTypes=+ssh-rsa" >> /etc/ssh/sshd_config
echo "sucesso"
echo
echo

echo "########## Permissão ALL para usuário $USER_NAME ##########"
sudoers_file="/etc/sudoers.d/$USER_NAME"
if [ ! -f "$sudoers_file" ]; then
    # Cria o arquivo apenas se ele não existir
    echo "$USER_NAME ALL=(ALL) NOPASSWD:ALL" > "$sudoers_file"
else
    echo "O arquivo $sudoers_file já existe. Não é necessário criar."
fi
echo "Permissão ALL criada com sucesso."

fi