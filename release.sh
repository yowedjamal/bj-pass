#!/bin/bash

# Script de déploiement automatisé avec Git Flow
set -e  # Stop on error

# Vérification des arguments
if [ "$#" -ne 2 ]; then
  echo "❌ Usage: $0 <version> <version-type>"
  echo "Exemple: $0 2.1.0 minor"
  exit 1
fi

VERSION=$1
TYPE=$2

# Validation du type de version
if [[ ! "$TYPE" =~ ^(major|minor|patch)$ ]]; then
  echo "❌ Type de version invalide. Choisir: major, minor ou patch"
  exit 1
fi

# Vérification de la branche
CURRENT_BRANCH=$(git branch --show-current)
if [ "$CURRENT_BRANCH" != "develop" ]; then
  echo "❌ ERREUR : Vous devez être sur develop pour lancer une release"
  exit 1
fi

# 1. Démarrer la release
echo "🚀 Démarrage de la release $VERSION..."
git flow release start $VERSION

# 2. Mise à jour de version
echo "🔄 Mise à jour de la version (npm version $TYPE)..."
npm version $TYPE -m "chore(release): bump version to %s [skip ci]"

# 3. Finalisation de la release
echo "🏁 Finalisation de la release..."
git flow release finish -m "$VERSION" $VERSION

# 4. Synchronisation avec GitHub
echo "📡 Pushing vers GitHub..."
git push origin develop main --tags

# 5. Création de la release GitHub (optionnel)
echo "📦 Création de la release GitHub..."
gh release create $VERSION --generate-notes

echo "✅ Release $VERSION complétée avec succès!"