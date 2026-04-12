# Démo de déploiement d'une application dans l'écosystème Docker

- [Démo de déploiement d'une application dans l'écosystème Docker](#démo-de-déploiement-dune-application-dans-lécosystème-docker)
  - [Checklist](#checklist)
  - [Application démo](#application-démo)
  - [Lancer le projet (env de dev)](#lancer-le-projet-env-de-dev)
  - [Lancer le projet (env de prod)](#lancer-le-projet-env-de-prod)
  - [Build image de prod de la web API](#build-image-de-prod-de-la-web-api)
  - [Progression typique](#progression-typique)
  - [Pipeline CI/CD](#pipeline-cicd)
    - [En amont](#en-amont)
    - [CI/CD](#cicd)
      - [CI](#ci)
      - [CD](#cd)
  - [Améliorations](#améliorations)
  - [Liens utiles](#liens-utiles)
    - [Tooling](#tooling)

## Checklist

- Bien séparer env (fichiers .env) []
- Script Makefile/alias pour commande docker avec merge des fichiers compose []
- API fonctionne en dev []
- API fonctionne en mode prod []
- Ajouter linter []
- Ajouter pre-commit hook linter/analyse statique avec https://typicode.github.io/husky/ []
- Pipeline CI/CD avec Sonarqube, docker scout et tests []
- Décrire les différentes phases de tests (local, repo) []
- Ajouter test unitaire démo []
- Ajouter test d'intégration avec testcontainer []
- Processus de déploiement en prod sur la vm sans downtime (blue/green, docker swarm rolling update) []
- Compléter le README.md []

## Application démo

Une simple web API en Node.js/Express.js couplé à une base de données PostgreSQL. L'application expose une ressource `/v1/concerts`

L'application est couverte par :

- Des tests unitaires et fonctionnels (*stateless*), avec [Jest](https://jestjs.io/fr/) ;
- Des tests d'intégration (*stateful*), reposant sur une base de données réelle provisionnée dynamiquement via [Testcontainers](https://testcontainers.com/)

## Lancer le projet (env de dev)

~~~bash
mkdir db-data
cp .env.dist .env
docker compose -f compose.yaml -f compose.dev.yaml up -d --build
~~~

## Lancer le projet (env de prod)

~~~bash
docker compose -f compose.yaml -f compose.prod.yaml up api -d --build
~~~

## Build image de prod de la web API

~~~bash
docker build --target production --tag api .
~~~

## Progression typique

## Pipeline CI/CD

### En amont

- Git hook pre-commit : linter

### CI/CD

> Déclenchée sur le serveur distant hébergeant le dépôt git (GitHub et Github Actions)

#### CI

#### CD

## Améliorations

- Créer et utiliser un utilisateur mysql différent de root dédié à l'application

## Liens utiles

- [Best Practices Around Production Ready Web Apps with Docker Compose](https://nickjanetakis.com/blog/best-practices-around-production-ready-web-apps-with-docker-compose), de [Nick Janetakis](https://nickjanetakis.com/about). Publié en 2021, des choses ont changé sur docker compose depuis mais reste pertinent sur de nombreux points
- [Mettre à jour les images Docker : la méthode de Bearstech](https://bearstech.com/societe/blog/mettre-a-jour-les-images-docker-la-methode-de-bearstech/)

### Tooling

- [Testcontainers](https://testcontainers.com/), lib open source fournissant une API pour instancier des dépendances stateful (ex base de données) pour les tests d'intégration
- [Husky](https://typicode.github.io/husky/)
