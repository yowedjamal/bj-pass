#!/bin/bash
set -e

# Couleurs pour le terminal
RED='\033[0;31m'
GREEN='\033[0;32m'
NC='\033[0m' # No Color

# Vérification des outils requis
check_requirements() {
  local missing=0
  
  if ! command -v git-flow &> /dev/null; then
    echo -e "${RED}✗ git-flow non installé${NC}"
    missing=1
  fi

  if ! command -v npm &> /dev/null; then
    echo -e "${RED}✗ npm non installé${NC}"
    missing=1
  fi

  if [ $missing -ne 0 ]; then
    echo -e "\nInstallez les dépendances manquantes avant de continuer."
    exit 1
  fi
}

# Main
check_requirements

if [ "$#" -ne 2 ]; then
  echo -e "${RED}❌ Usage: $0 <version> <version-type>${NC}"
  echo "Exemple: $0 2.1.0 minor"
  exit 1
fi

VERSION=$1
TYPE=$2

if [[ ! "$TYPE" =~ ^(major|minor|patch)$ ]]; then
  echo -e "${RED}❌ Type invalide. Choisir: major, minor ou patch${NC}"
  exit 1
fi

CURRENT_BRANCH=$(git branch --show-current)
if [ "$CURRENT_BRANCH" != "develop" ]; then
  echo -e "${RED}❌ ERREUR : Branche actuelle: $CURRENT_BRANCH"
  echo -e "Vous devez être sur develop${NC}"
  exit 1
fi

echo -e "${GREEN}🚀 Démarrage release $VERSION...${NC}"
git flow release start $VERSION

echo -e "${GREEN}🔄 Mise à jour version ($TYPE)...${NC}"
npm version $TYPE -m "chore(release): v%s [skip ci]"

echo -e "${GREEN}🏁 Finalisation release...${NC}"
git flow release finish -m "$VERSION" $VERSION

echo -e "${GREEN}📡 Push vers GitHub...${NC}"
git push origin develop main --tags

echo -e "\n${GREEN}✅ Release $VERSION prête!${NC}"
echo -e "Pour créer la release GitHub:"
echo -e "1. Allez sur https://github.com/votre-repo/releases/new"
echo -e "2. Sélectionnez le tag $VERSION"
echo -e "3. Remplissez les notes de release"
echo -e "4. Publiez\n"

# Alternative si gh est installé
if command -v gh &> /dev/null; then
  read -p "Créer la release GitHub automatiquement ? (y/n) " -n 1 -r
  echo
  if [[ $REPLY =~ ^[Yy]$ ]]; then
    gh release create $VERSION --generate-notes
  fi
fi