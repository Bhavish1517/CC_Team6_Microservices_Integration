# CC_Team6_Microservices_Integration

## Integration 1
### Cloud Storage microservice with Notification microservice

The **Cloud Storage Microservice** is responsible for managing file operations such as upload, download, view, and delete. It is built using FastAPI and integrated with AWS S3 to handle file storage. The service enforces per-user storage quotas and sends alerts when users exceed 80% of their assigned quota. It also supports file uploads with folder structures.

The Notification Microservice is a lightweight Flask application that handles email notifications and scheduled reminders. It supports sending immediate email alerts and allows users to set future reminders. It uses SMTP (Gmail SMTP by default) to send emails.

The Integration between the two microservices is achieved through inter-service HTTP API communication. When the Cloud Storage Microservice detects that a user's storage usage exceeds the defined threshold (e.g., 80%), it makes a POST request to the Notification Microservice's /send_notification endpoint, triggering an email alert to the user. The two services run in isolated containers and are connected through a shared Docker network.

## Setup and Run Instructions
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
