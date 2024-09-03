# Proyecto de Aplicación Node con Next.js y Express

Este proyecto es una aplicación desarrollada en Node.js utilizando Next.js para el frontend y Express para el backend. A continuación, se presentan las instrucciones para configurar y dockerizar la aplicación.

## Requisitos Previos

Antes de comenzar, asegúrate de tener instalados los siguientes programas en tu máquina:

- [Docker](https://www.docker.com/get-started)
- [Docker Compose](https://docs.docker.com/compose/install/)

## Configuración de Docker

### Dockerfile del Backend

Ubicación: `back-end/autos/Dockerfile`
```yaml
FROM node:18

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY wait-for-it.sh /usr/src/app/wait-for-it.sh

RUN chmod +x /usr/src/app/wait-for-it.sh

COPY . .

EXPOSE 3000

CMD ["./wait-for-it.sh", "mariadb:3306", "--", "npm", "start"]'
```
### Dockerfile del Frontend

Ubicación: `front-end/autos/Dockerfile`

```yaml
FROM node:18

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3001

CMD ["npm", "run", "dev"]
```
### Docker Compose

Ubicación: `docker-compose.yml`

```yaml
version: '3'
services:
  backend:
    build:
      context: ./back-end/autos/
    ports:
      - "3000:3000"
    depends_on:
      - mariadb

  frontend:
    build:
      context: ./front-end/autos/
    ports:
      - "3001:3000"

  mariadb:
    image: mariadb:latest
    environment:
      MYSQL_ROOT_PASSWORD: <ROOT_PASSWORD>
      MYSQL_DATABASE: <NAME_DATABASE>
      MYSQL_USER: <USER_DATABASE>
      MYSQL_PASSWORD: <DATABASE_PASSWORD>
    ports:
      - "3307:3306"
    volumes:
      - db_data:/var/lib/mysql

volumes:
  db_data:
```
## Instrucciones de Configuración y Ejecución

### Clonar el Repositorio

Clona este repositorio en tu máquina local.

- git clone <URL_DEL_REPOSITORIO>
- cd <NOMBRE_DEL_REPOSITORIO>

### Construir y Levantar los Contenedores

Utiliza Docker Compose para construir y levantar los contenedores.

docker-compose up --build

### Acceder a la Aplicación

- Frontend: Abre tu navegador web y visita http://localhost:3001.
- Backend: El backend estará corriendo en http://localhost:3000.