FROM ubuntu:22.04 AS build
ARG USER_NAME
#ARG PRIVATE_KEY_PASSWORD
ARG IMAGE_NAME
ARG CONTAINER_NAME
ARG PROJECT_NAME
ARG MAP_PORT_SSH
ARG GITHUB_CLONE_REPOS
ARG GITHUB_CLONE_BRANCH
ARG DEV_PORT

ENV USER_NAME=${USER_NAME}
ENV PROJECT_NAME=${PROJECT_NAME}
ENV DEV_PORT=${DEV_PORT}

WORKDIR /${PROJECT_NAME}

### TimeZone ###
ENV TZ=America/Recife
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone


### Pacotes e dependências ###
RUN apt-get update -y

### Dependências LINUX e ferramentas ###
RUN apt-get install -y \
sudo \
passwd \
openssh-server \
zip \
unzip \
net-tools \
curl \
git \
ca-certificates \
samba \
iputils-ping \
iptables \
iproute2 \
gnupg \
lsb-release \
openvpn \
kmod \
rsync \
ghostscript \
&& apt-get clean

### Variáveis e Scripts ###
COPY ./.env /usr/local/bin/
RUN chmod +x /usr/local/bin/.env
RUN mkdir -p /etc/openvpn
COPY assets/openvpn/ /etc/openvpn/

### Configuração SSH/root ###
#COPY ./scripts/ssh_root.sh /usr/local/bin/
#RUN chmod +x /usr/local/bin/ssh_root.sh


### Criação de Usuário ###
RUN mkdir -p /var/run/sshd

COPY ./scripts/create_user.sh /usr/local/bin/
COPY ./assets/USER_PUBLIC_KEY /usr/local/bin/
RUN chmod +x /usr/local/bin/create_user.sh \
	&& bash /usr/local/bin/create_user.sh


### Github ###
# Configurando chave de acesso ao github
COPY ./assets/id_rsa_github /etc/ssh
RUN sudo chmod 600 /etc/ssh/id_rsa_github
# Configurando known_hosts do github
RUN sudo mkdir -p /root/.ssh \
	&& sudo chmod 700 /root/.ssh \
	&& sudo touch /root/.ssh/known_hosts \
	&& sudo chmod 600 /root/.ssh/known_hosts \
	&& ssh-keyscan -t rsa github.com >> ~/.ssh/known_hosts \
	&& cp ~/.ssh/known_hosts /home/${USER_NAME}/.ssh \
	&& chown ${USER_NAME}:${USER_NAME} /home/$USER_NAME/.ssh/known_hosts;


# Configurando acesso ao github
RUN cp /etc/ssh/id_rsa_github /home/${USER_NAME}/.ssh \
	&& sudo chown ${USER_NAME}:${USER_NAME} /home/${USER_NAME}/.ssh/id_rsa_github \
	&& cp /home/${USER_NAME}/.ssh/id_rsa_github /root/.ssh/id_rsa_github \
	&& chmod 600 /root/.ssh/id_rsa_github \
	&& echo "IdentityFile /root/.ssh/id_rsa_github" >> /etc/ssh/ssh_config \
	&& echo "IdentityFile /home/${USER_NAME}/.ssh/id_rsa_github" >> /etc/ssh/ssh_config
#RUN eval "$(ssh-agent -s)"
#RUN ssh-add /home/${USER_NAME}/.ssh/id_rsa_github


### Instalando node e vue para o usuário ###
USER ${USER_NAME}
RUN curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash \
    	&& export NVM_DIR="$HOME/.nvm" \
    	&& [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh" \
    	&& nvm install --lts \
    	&& nvm use --ltsRUN su - nvm alias default "lts/*" \
    	&& sudo ln -sf $NVM_DIR/versions/node/$(nvm version)/bin/node /usr/local/bin/node \
    	&& sudo ln -sf $NVM_DIR/versions/node/$(nvm version)/bin/npm /usr/local/bin/npm \
    	&& sudo ln -sf $NVM_DIR/versions/node/$(nvm version)/bin/npx /usr/local/bin/npx \
    	&& npm install -g npm@latest \
    	&& npm install -g @quasar/cli \
    	&& npm update -g @quasar/cli


### Configurando projeto ###
#RUN cd /${PROJECT_NAME}
#RUN vue create ${PROJECT_NAME} --preset default
USER root
RUN mkdir -p /${PROJECT_NAME} \
    	&& sudo chmod -R 777 /${PROJECT_NAME} \
    	&& sudo chown -R ${USER_NAME}:${USER_NAME} /${PROJECT_NAME} \
    	&& sudo git clone --branch ${GITHUB_CLONE_BRANCH} --single-branch ${GITHUB_CLONE_REPOS} /${PROJECT_NAME}
# Reconfigurando node modules do projeto clonado
RUN cd /${PROJECT_NAME} \
    	&& sudo rm -rf node_modules package-lock.json src-capacitor \
    	&& npm install \
	&& sudo chmod -R 777 /${PROJECT_NAME} \
    	&& sudo chown -R ${USER_NAME}:${USER_NAME} /${PROJECT_NAME}

### Openvpn
#COPY ./assets/openvpn /etc/openvpn


### Configurando o SAMBA para compartilhamento ###
RUN echo "\n[${PROJECT_NAME}]\npath = /${PROJECT_NAME}\nread only = no\nbrowsable = yes\nguest ok = yes\ncreate mask = 0777\ndirectory mask = 0777" | sudo tee -a /etc/samba/smb.conf


### Portas expostas ###
EXPOSE 22 ${DEV_PORT}


### Inicia o ssh e o server ###
CMD ["sh", "-c", "/usr/sbin/sshd -D"]