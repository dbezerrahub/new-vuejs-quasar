. .env

# Limpando container
if docker ps -a | grep -q $CONTAINER_NAME; then
    docker rm -f $CONTAINER_NAME
	echo "container $CONTAINER_NAME excluido"
fi

# Deleta a imagem se já existir e cria uma nova para atualizar possíveis alterações do Dockerfile
echo "Criando Imagem $IMAGE_NAME..."
if docker images | grep -q $IMAGE_NAME; then
    docker rmi -f $IMAGE_NAME
fi

export $(grep -v '^#' .env | xargs) && docker build \
--build-arg USER_NAME=$USER_NAME \
--build-arg IMAGE_NAME=$IMAGE_NAME \
--build-arg CONTAINER_NAME=$CONTAINER_NAME \
--build-arg PROJECT_NAME=$PROJECT_NAME \
--build-arg MAP_PORT_SSH=$MAP_PORT_SSH \
--build-arg GITHUB_CLONE_REPOS=$GITHUB_CLONE_REPOS \
--build-arg GITHUB_CLONE_BRANCH=$GITHUB_CLONE_BRANCH \
--build-arg DEV_PORT=$DEV_PORT \
-t $IMAGE_NAME .


echo "Imagem $IMAGE_NAME criada"

echo

echo "Excluindo container do host"
rm -rf /$PROJECT_NAME

echo "Criando Container $CONTAINER_NAME..."

docker run -dit --name $CONTAINER_NAME --network rede_macvlan --ip 192.168.0.67 --mac-address="02:45:f0:a9:00:68" --cap-add=NET_ADMIN --cap-add=NET_RAW --device /dev/net/tun:/dev/net/tun -d $IMAGE_NAME


