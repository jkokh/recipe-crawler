# Recipe Crawler

A TypeScript application for crawling recipe websites.

## MySQL Docker Container

This project includes a Docker configuration for a MySQL database that can be used to store recipe data.

### Prerequisites

- [Docker](https://www.docker.com/get-started) installed on your machine
- [Docker Compose](https://docs.docker.com/compose/install/) installed on your machine

### Starting the MySQL Container

To start the MySQL container, run the following command from the project root directory:

```bash
docker-compose up -d
```

This will start a MySQL 8.0 container with the following configuration:

- Container name: recipe-crawler-mysql
- Port: 3310 (accessible from the host machine)
- Database name: recipe_crawler
- User: recipe_user
- Password: recipe_password
- Root password: rootpassword

### Stopping the MySQL Container

To stop the MySQL container, run the following command from the project root directory:

```bash
docker-compose down
```

To stop the container and remove the volume (which will delete all data), run:

```bash
docker-compose down -v
```

### Connecting to MySQL

You can connect to the MySQL database using any MySQL client with the following connection details:

- Host: localhost or 127.0.0.1
- Port: 3310
- Database: recipe_crawler
- Username: recipe_user
- Password: recipe_password

Example using the MySQL command-line client:

```bash
mysql -h 127.0.0.1 -P 3310 -u recipe_user -p'recipe_password' recipe_crawler
```

Or from inside the container:

```bash
docker exec -it recipe-crawler-mysql mysql -u recipe_user -p'recipe_password' recipe_crawler
```

### Data Persistence

The MySQL data is stored in a Docker volume named `recipe-crawler_mysql-data`. This ensures that your data persists even if the container is stopped or removed.

## Project Structure

The project is organized as follows:

- `src/crawler/`: Contains the crawler implementation
  - `config.ts`: Configuration for different recipe websites
  - `crawler.ts`: Main crawler entry point
  - `crawlerEngine.ts`: Core crawler logic
  - `fetchHtmlPuppeteer.ts`: Fetches HTML content using Puppeteer
  - `extractLinks.ts`: Extracts links from HTML content
  - `types.ts`: TypeScript type definitions

## Running the Application

To run the application, use the following command:

```bash
npm start
```

This will start the crawler with the default configuration.