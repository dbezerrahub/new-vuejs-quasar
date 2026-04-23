# Start app

# package.json

Configurar nome, versões... do aplicativo

# Capacitor.json

Configure o arquivo capacitor.config.json (copie de capacitor.config.local.json se necessário)

# Atualiza o capacitor

npm install @capacitor/cli@latest @capacitor/core@latest
npm install @capacitor/app@7
npm install @capacitor/toast@7
npx cap sync

# Crie a pasta android

npx cap add android

# Inicie o projeto

Verifique a porta que será usada em package.json "start": "quasar dev --debug --port 80 > server.log 2>&1 & echo $! > server.pid",
Use a porta 80 para desenvolvimento inicial se ainda não tiver host HTTPS. Mude para 445 quando tiver o host HTTPS (veja quasar.config.js > devServer:)

# Docker 
. Se desejar, no diretório docker execute create.sh para criar uma máquina completa (UBUNTU) com o projeto pronto.
Ajuste as configurações em .env antes e no diretório assets crie suas chaves para acesso a máquina (UBUNTU) e ao github para clonar o projeto caso queira clonar do seu github
. O openvpn é utilizado para conectar um servidor onine (AWS por exemplo) ao container. Isso permite utilizar domínios reais https (ex: https://seuprojeto.com) com esse container local. Isso é útili para desenvolvimento de ferramentas que exigem https como por exemplo FCM do Google. Deve ser feita a configuração no servidor online para funcionar por isso está comentado no dockerfile.
.  O container é executado com rede_macvlan que permite utilizar o container como uma máquina na rede. Util para acessar o código com vscode ou android studio além de acessar via ip da máquina (defina o ip em create.sh)
. Você pode acessar a máquina normalmente com ssh ou winscp utilizando o usuário e a chave privada criada
