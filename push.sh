#!/bin/bash
branch=$(git branch --show-current)
commit="${1:-update}"

#npm run android || exit 1
npm run copy_capacitor_config || exit 1
npm run build || exit 1
DIST_DIR="dist/spa"
CONFIG="./obfuscator.config.json"
MAKE_BACKUP=true   # muda para false se não quiser backups

# padrões (aceita qualquer hash depois do nome)
PATTERNS=(
  "MainLayout*.js"
  "WebServiceController*.js"
  "UserController*.js"
)

# encontra arquivos correspondentes recursivamente
files=()
for p in "${PATTERNS[@]}"; do
  while IFS= read -r -d $'\0' f; do
    files+=("$f")
  done < <(find "$DIST_DIR" -type f -name "$p" -print0)
done

if [ ${#files[@]} -eq 0 ]; then
  echo "Nenhum arquivo correspondente a ${PATTERNS[*]} encontrado em $DIST_DIR"
  exit 0
fi

for f in "${files[@]}"; do
  echo "   Obfuscando $f ..."
  # javascript-obfuscator "$f" --output "$f" --config "$CONFIG"
  echo "   OK: $f"
done

npx cap sync android
sudo chmod -R 777 /callauth

git add .
git commit -m "$commit" || echo "⚠️ Nenhuma alteração para commitar"

git push -u origin "$branch" || exit 1

#npm run android
