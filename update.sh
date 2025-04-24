git fetch origin main

# Compara o último commit local com o remoto
LOCAL=$(git rev-parse main)
REMOTE=$(git rev-parse origin/main)

if [ "$LOCAL" != "$REMOTE" ]; then
    echo "📦 Atualizando aplicação"
    git pull

    # Removendo imagem docker
    docker stop web-data-viz
    docker rm web-data-viz
    docker rmi web-data-viz

    docker build -t web-data-viz .
    docker run --name web-data-viz -p 80:80 --restart unless-stopped web-data-viz -d

    echo "Deploy do web-data-viz concluído"
fi