# CC_Team6_Microservices_Integration

### Integrations
1. Cloud Storage with Notification Microservice (Team 10)
2. Calender with User Progress Management Service (Team 13)
3. SSO with Certificate and Interactive Tutotrials Microservices (Team 19)

## Integration 1
### Cloud Storage microservice with Notification microservice

The **Cloud Storage Microservice** is responsible for managing file operations such as upload, download, view, and delete. It is built using FastAPI and integrated with AWS S3 to handle file storage. The service enforces per-user storage quotas and sends alerts when users exceed 80% of their assigned quota.

The Notification Microservice is a Flask application that handles email notifications and scheduled reminders. It uses SMTP (Gmail SMTP by default) to send emails.

The Integration between the two microservices is achieved through inter-service HTTP API communication. When the Cloud Storage Microservice detects that a user's storage usage exceeds the defined threshold (e.g., 80%), it makes a POST request to the Notification Microservice's /send_notification endpoint, triggering an email alert to the user. The two services run in isolated containers and are connected through a shared Docker network.

#### Setup and Run Instructions
1. First create a .env file in the Cloud Storage folder. Define the AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_REGION and the AWS_S3_BUCKET_NAME with the respective values from your AWS account after creating S3 storage instance.
2. Edit the docker-compose.yml file in the notification microservice folder to enter the sender'e email, username and password (Google App password -> Need to create one in the security settings) in oorder to send out emails.
3. Open terminals in the respective microservice folders and in both the terminals run the following commands:
```bash
docker-compose build
docker-compose up -d
```
4. Open the Storage microservice at localhost:80
5. Once completed using you can stop the containers by running the following command in both terminals:
```bash
docker-compose down
```

## Integration 2
### Calendar Microservice with User Progress Management Microservice

The Calendar Microservice is developed using React and JavaScript and provides a user-friendly frontend interface for managing events. It exposes RESTful API endpoints (GET, POST, DELETE) to create, update, and delete calendar events. All event data is stored in a MongoDB cluster to ensure scalability and efficient data handling.

The User Progress Management Microservice is built using FastAPI and offers endpoints for managing users, labs, and their progress. It supports create, retrieve, and delete operations, enabling seamless tracking of user activity across various labs.

The integration between the two microservices is achieved through inter-service HTTP API communication. When labs are added or deleted via the User Progress Management Microservice, the Calendar Microservice sends a GET request to the /labs/ endpoint to fetch the current list of labs. It then compares the list with its own database—new labs are added as calendar events, while removed labs are deleted from the calendar database.

#### Setup and Run Instructions
1. Open terminals in the respective microservice folders and in both the terminals run the following commands:
```bash
docker-compose build
docker-compose up -d
```
2. Open the Calendar microservice at [localhost:3000](http://localhost:3000/) and User progress management service at [localhost:8004/](http://localhost:8004/docs#/default)
3. Open http://localhost:8004/labs to fetch the labs created.
4. Use the localhost:5000/api/events to find the lab events added to the calendar database.
5. Once completed using you can stop the containers by running the following command in both terminals:
```bash
docker-compose down
```
