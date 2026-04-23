source env
ROOT_PUBLIC_KEY="ssh-rsa $(awk '/BEGIN SSH2 PUBLIC KEY/{flag=1; next} /END SSH2 PUBLIC KEY/{flag=0} flag' /usr/local/bin/ROOT_PUBLIC_KEY | awk '!/^Comment:/{print}')"
ROOT_PUBLIC_KEY=${ROOT_PUBLIC_KEY//$'\n'/}

mkdir -p /var/run/sshd
echo "root:$SENHA_ROOT" | chpasswd
sed -i 's/#PermitRootLogin prohibit-password/PermitRootLogin yes/' /etc/ssh/sshd_config
sed -i 's/#PasswordAuthentication yes/PasswordAuthentication yes/' /etc/ssh/sshd_config

authorized_keys_file="/root/.ssh/authorized_keys"
if [ ! -f "$authorized_keys_file" ]; then
echo "########## Criando authorized_keys para o usuário root ##########"
mkdir -p /root/.ssh &&
echo "$ROOT_PUBLIC_KEY" > /root/.ssh/authorized_keys &&
chown root:root /root/.ssh
chmod 0700 /root/.ssh &&
chown root:root /root/.ssh/authorized_keys
chmod 0600 /root/.ssh/authorized_keys
echo "authorized_keys criado com sucesso."
echo
echo

echo "########## Retirando acesso via password ##########"
echo >> /etc/ssh/sshd_config
echo "Match User root" >> /etc/ssh/sshd_config
echo "PasswordAuthentication no" >> /etc/ssh/sshd_config
echo "AuthorizedKeysFile /root/.ssh/authorized_keys" >> /etc/ssh/sshd_config
echo "PubkeyAcceptedKeyTypes=+ssh-rsa" >> /etc/ssh/sshd_config
echo "sucesso"
fi