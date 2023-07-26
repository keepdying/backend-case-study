# Codeway Backend Case Study

This repository contains the source code for the Codeway case study. The case study is to implement an API that can handle event logs from various clients and store them in Google BigQuery. Then the API should be able to query the data from BigQuery and return the results for analytic purposes.

## Tech Stack

![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![NestJS](https://img.shields.io/badge/nestjs-%23E0234E.svg?style=for-the-badge&logo=nestjs&logoColor=white)
![Docker](https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white)
![Kubernetes](https://img.shields.io/badge/kubernetes-%23326ce5.svg?style=for-the-badge&logo=kubernetes&logoColor=white)
![GitHub Actions](https://img.shields.io/badge/github%20actions-%232671E5.svg?style=for-the-badge&logo=githubactions&logoColor=white)
![Google Cloud](https://img.shields.io/badge/GoogleCloud-%234285F4.svg?style=for-the-badge&logo=google-cloud&logoColor=white)

The API is built using NestJS. The API is containerized using Docker and deployed to a Kubernetes cluster on Google Kubernetes Engine (GKE) Auto Cluster which allows to scale on-demand. The containerization process is automated using GitHub Actions then containerizated image pushed to Google Artifact Repository.

## Architecture

For this case study, I have chosen to use the following architecture:

![Architecture](https://github.com/keepdying/codeway-case/assets/10383811/5fb75f8f-7c23-4e04-b342-42dfa0683983)

For the sake of simplicity, The API exposed to Internet behind a LoadBalancer. In a real production environment, The API would be behind an API gateway for such Authentication and Authorization purposes. The API gateway would also be responsible for routing the requests to the appropriate microservice.

For incoming requests, API publishes event logs to Google Pub/Sub which is a fully managed real-time messaging service that allows to send and receive messages between independent applications. Then I pipelined the event logs from Pub/Sub directly to Google BigQuery.

For outgoing requests, the API queries the data from BigQuery and returns the results to the client.

## Usage

### Development

To run the API locally, you need to have Node.js and npm installed on your machine. You need to have a Google Cloud Service Account with following permissions:

- Pub/Sub Writer
- BigQuery Job User

Then you need to create a .env file in the root directory of the project and add the following environment variables:

```yaml
GOOGLE_APPLICATION_CREDENTIALS=<path to your service account json file>
GOOGLE_CLOUD_PROJECT=<your google cloud project id>
```

Then you can run the following commands:

```bash
# Install dependencies
$ npm install

# Run the API
$ npm run start:dev
```

### Production

To run the API in production, you need to have Docker installed on your machine. You need to have a Google Cloud Service Account with following permissions:

- Pub/Sub Writer
- BigQuery Job User

Then you can build and run the Docker Image with following commands:

```bash
# Build the docker image
$ docker build -t analytics-endpoint .

# Run the docker image with google cloud service account json file mounted
$ docker run -p 3000:3000 analytics-endpoint -v <path to your service account json file>:/var/secrets/google/key.json \
-e GOOGLE_APPLICATION_CREDENTIALS=/var/secrets/google/key.json \
-e GOOGLE_CLOUD_PROJECT=<your google cloud project id>
-e BIGQUERY_TABLE_NAME=<your bigquery table name>
```

## API Usage

### POST /analytics/event

This endpoint is used to send event logs to the API. The API will publish the event logs to Google Pub/Sub.

#### Example Request Body

```json
{
  "type": "event",
  "session_id": "9FDA74C2-AB57-4840-87D0-64324772B5A2",
  "event_name": "click",
  "event_time": 1589623711,
  "page": "main",
  "country": "TR",
  "region": "Marmara",
  "city": "Istanbul",
  "user_id": "Uu1qJzlfrxYxOS5z1kfAbmSA5pF2"
}
```

### GET /analytics/daily

This endpoint is used to query the data from BigQuery and return the results. The API will query the data from BigQuery and return the analytics below:

- Total user count
- Daily active user count
- Daily new users
- Daily average session duration in seconds.

### Example Response Body

```json
{
"total_users": 1000,
"daily_stats": [
  {
    "date": "12/01/2021",
    "average_session_duration": 45,
    "active_user_count": 100,
    "new_user_count": 45
  },
  ...
  ]
}
```

## Further Improvements

- Implement it as a microservice and put it behind an API gateway for Authentication and Authorization purposes.
- Kubernetes with Helm for better deployment and management.
- Unit and Integration tests.
