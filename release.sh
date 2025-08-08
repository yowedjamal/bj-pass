#!/bin/bash

# Vérification des arguments
if [ "$#" -ne 2 ]; then
  echo "Usage: ./release.sh <version> <version-type>"
  echo "Exemple: ./release.sh 2.1.0 minor"
  exit 1
fi

CURRENT_BRANCH=$(git branch --show-current)
if [ "$CURRENT_BRANCH" != "master" ]; then
  echo "ERREUR : Vous devez être sur master pour lancer une release"
  exit 1
fi

VERSION=$1
TYPE=$2

# Démarre une nouvelle release avec Git Flow
git flow release start $VERSION

# Met à jour la version dans package.json
npm version $TYPE -m "Bump version to %s"

# Finalise la release
git flow release finish -m $VERSION $VERSION

# Pousse tout vers GitHub
git push origin main master --tags