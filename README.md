# article-management-api

## Tech Stack:

-  Backend: Node.js using TypeScript
-  Framework: NestJS
-  Database: MySQL
-  Cache: NesJS Caching
-  Migration: Knex
-  Authentication: JWT
-  Infrastructure: Docker
-  Documentation: Swagger
-  Testing: Jest

# The idea of this project is to create a RESTful API for managing articles. The API should be able to:

-  Login (Authentication)
-  Create an author
-  Get a list of all authors
-  Get a specific author by ID

-  Create an article
-  Get a list of all articles
-  Get a specific article by ID
-  Delete an article by ID (ADMIN ONLY)

-  Create a comment
-  Get a list of all comments
-  Get a specific comment by ID

# Tables:

## authors

    - id (Primary Key, Auto Increment)
    - name (String)
    - email (String, Unique)
    - password (String)
    - is_admin (Boolean, Default: false)

## articles

    - id (Primary Key, Auto Increment)
    - author_id (Foreign Key -> authors.id)
    - title (String)
    - content (String)
    - created_at (Date)

## comments

    - id (Primary Key, Auto Increment)
    - article_id (Foreign Key -> articles.id)
    - author_id (Foreign Key -> authors.id)
    - content (String)
    - created_at (Date)

# Required ENV's

-  PORT=4000

-  DB_HOST=mysql
-  DB_USER=test
-  DB_PASSWORD=password
-  DB_NAME=test_db
-  DB_PORT=3306

-  SECRET_KEY=secret
-  EXPIRATION_TIME=25m

# Run Project using Docker

-  clone the project

# To run project in development mode

-  `npm run docker:dev`

# To run project in production mode

-  `npm run docker:prod`

# Run tests

-  `npm i`
-  `npm run test`

# add migration

-  `npm run add-migration <migration-name>`

-  It will start the server on port 4000 & api is available to consume

   -  API Docs - http://localhost:4000/api-docs

   -  Health check: GET - http://localhost:4000/api/health

   -  Create Author: POST - http://localhost:4000/api/author
   -  Login (Authentication): POST - http://localhost:4000/api/auth
   -  Get All Authors: GET - http://localhost:4000/api/authors
   -  Get Author By Id: GET - http://localhost:4000/api/author/:id

   -  Create Article: POST - http://localhost:4000/api/article
   -  Get All Articles: GET - http://localhost:4000/api/articles
   -  Get Article By Id: GET - http://localhost:4000/api/article/:id
   -  Delete Article By Id: DELETE - http://localhost:4000/api/article/:id

   -  Create Comment: POST - http://localhost:4000/api/comment
   -  Get All Comments: GET - http://localhost:4000/api/comments
   -  Get Comment By Id: GET - http://localhost:4000/api/comment/:id

-  By default we've 2 entries in database through migration

# Admin

email: admin@gmail.com
password: admin

# Author

email: user1@gmail.com
password: pass1

# Request body

-  healthCheck - GET - /api/health
   No body required

-  createAuthor - POST - /api/author

```sh
{
   "name": "string",
   "email": "string",
   "password": "string"
}
```

-  login - POST - /api/auth

```sh
{
   "email": "string",
   "password": "string"
}
```

-  Note - Access token is valid for 25 minutes once created

-  getAuthors - GET - /api/authors
   `Authorization: Bearer <accessToken>` required in headers
   No body required

-  getAuthorById - GET - /api/author/:id
   `Authorization: Bearer <accessToken>` required in headers
   No body required

-  createArticle - POST - /api/article
   `Authorization: Bearer <accessToken>` required in headers

```sh
{
   "title": "string",
   "content": "string"
}
```

-  getArticles - GET - /api/articles
   `Authorization: Bearer <accessToken>` required in headers
   No body required

-  getArticleById - GET - /api/article/:id
   `Authorization: Bearer <accessToken>` required in headers
   No body required

-  deleteArticleById - DELETE - /api/article/:id
   `Authorization: Bearer <accessToken>` required in headers
   No body required
-  Note - Only available for admin users

-  createComment - POST - /api/comment
   No Authenticaion required

```sh
{
   "authorId": "string",
   "articleId": "string",
   "content": "string"
}
```

-  getCommentById - GET - /api/comment/:id
   No Authenticaion required
   No body required

-  getComments - GET - /api/comments
   No Authenticaion required
   No body required

# Project Structure

-  src/
   -  main.ts - entry point of the project
   -  module/
      -  author/ - author module
      -  article/ - article module
      -  comment/ - comment module
      -  authentication/ - authentication module
      -  database/ - database module
      -  adapters/ - adapters for author, article, comment

   -  types/ - has all types/interfaces used through out the project
   -  utils/ - has common functionality used through out the project (messages, enums, error handler etc..)
   -  test/ - has test configuration
   -  migrations/ - has all migration files

-  knexfile.ts - knex configuration file
-  Dockerfile - docker file
-  docker-compose.dev.yml - yml file with all configurations for development
-  docker-compose.yml - yml file with all configurations for production
