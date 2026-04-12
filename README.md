# Démo de déploiement d'une application dans l'écosystème Docker

- [Démo de déploiement d'une application dans l'écosystème Docker](#démo-de-déploiement-dune-application-dans-lécosystème-docker)
  - [Checklist](#checklist)
  - [Application démo](#application-démo)
  - [Lancer le projet (env de dev)](#lancer-le-projet-env-de-dev)
  - [Lancer le projet (env de prod)](#lancer-le-projet-env-de-prod)
  - [Build image de prod de la web API](#build-image-de-prod-de-la-web-api)
  - [Progression typique](#progression-typique)
  - [Pipeline CI/CD](#pipeline-cicd)
    - [CI/CD](#cicd)
      - [CI](#ci)
      - [CD](#cd)
  - [Améliorations](#améliorations)
  - [Liens utiles](#liens-utiles)
    - [Tooling](#tooling)

## Checklist

- Bien séparer env (fichiers .env) [x]
- Script Makefile/alias pour commande docker avec merge des fichiers compose []
- API fonctionne en dev [x]
- API fonctionne en mode prod [x]
- Ajouter linter []
- Ajouter pre-commit hook linter/analyse statique avec https://typicode.github.io/husky/ []
- Pipeline CI/CD avec Sonarqube, docker scout et tests []
- Décrire les différentes phases de tests (local, repo) []
- Ajouter test unitaire démo []
- Ajouter test d'intégration avec testcontainer []
- Processus de déploiement en prod sur la vm sans downtime (blue/green, docker swarm rolling update) []
- Compléter le README.md []

## Application démo

Une simple web API en Node.js/Express.js couplé à une base de données relationnelle. L'application expose une ressource `/v1/users`.

L'application est couverte par :

- Des tests unitaires et fonctionnels (*stateless*), avec [Jest](https://jestjs.io/fr/) ;
- Des tests d'intégration (*stateful*), reposant sur une base de données réelle provisionnée dynamiquement via [Testcontainers](https://testcontainers.com/)

## Lancer le projet (env de dev)

~~~bash
mkdir db-data
cp .env.dist .env
docker compose -f compose.yaml -f compose.dev.yaml build api
docker compose -f compose.yaml -f compose.dev.yaml up --watch
~~~

## Lancer le projet (env de prod)

~~~bash
docker compose -f compose.yaml -f compose.prod.yaml --env-file .env.prod up -d --build
~~~

## Build image de prod de la web API

~~~bash
docker build --target production --tag api .
~~~

## Progression typique

1. On [lance le projet en mode dev (hot reload via watch)](#lancer-le-projet-env-de-dev)
2. On développe (modifie sources)
3. On commit, déclenche hook *pre-commit* (via *husky*) :
   1. Tests
   2. Linter
   3. Analyse statique via eslint
Si tout passe, le commit est validé en local.
4. Publie le commit sur le dépôt distant.
5. Déclenchement de la pipeline CI/CD.

## Pipeline CI/CD

### CI/CD

> Déclenchée sur le serveur distant hébergeant le dépôt git (GitHub et Github Actions)

#### CI

#### CD

## Améliorations

- Créer et utiliser un utilisateur mysql différent de `root` dédié à l'application ;
- Améliorer et personnaliser les règles de l'analyse statique et fixer un niveau d'exigence adapté ;

## Liens utiles

- [Best Practices Around Production Ready Web Apps with Docker Compose](https://nickjanetakis.com/blog/best-practices-around-production-ready-web-apps-with-docker-compose), de [Nick Janetakis](https://nickjanetakis.com/about). Publié en 2021, des choses ont changé sur docker compose depuis mais reste pertinent sur de nombreux points
- [Mettre à jour les images Docker : la méthode de Bearstech](https://bearstech.com/societe/blog/mettre-a-jour-les-images-docker-la-methode-de-bearstech/)

### Tooling

- [Testcontainers](https://testcontainers.com/), lib open source fournissant une API pour instancier des dépendances stateful (ex base de données) pour les tests d'intégration
- [Husky](https://typicode.github.io/husky/), gestion des hooks *pre-commit*
- [eslint](https://eslint.org/), linter et analyse statique des sources js
- [sonarjs](https://www.npmjs.com/package/eslint-plugin-sonarjs), plugin d'eslint pour la détection de *code smell*
