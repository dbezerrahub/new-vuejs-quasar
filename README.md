# Start app
# package.json
Configurar nome, versões... do aplicativo
# Capacitor.json
Configure o arquivo capacitor.config.json (copie de capacitor.config.local.json se necessário)
# Atualiza o capacitor
npm install @capacitor/cli@latest @capacitor/core@latest
# Crie a pasta android
npx cap add android
# Inicie o projeto
Verifique a porta que será usada em package.json     "start": "quasar dev --debug --port 80 > server.log 2>&1 & echo $! > server.pid",
Use a porta 80 para desenvolvimento inicial se ainda não tiver host HTTPS. Mude para 445 quando tiver o host HTTPS (veja quasar.config.js > devServer:)
