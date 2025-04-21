# CC_Team6_Microservices_Integration

### Integrations
1. Cloud Storage with Notification Microservice (Team 10)
2. Calender with User Progress Management Service (Team 13)
3. SSO with Certificate and Interactive Tutorials Microservices (Team 19)

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

## Overview: Calendar & User Progress Microservices

This system comprises two interlinked microservices to manage lab resources and calendar events. It demonstrates seamless synchronization and REST API integration between a FastAPI-based backend and a React-based frontend.

---

## System Overview

### Calendar Microservice

- **Frontend:** React + JavaScript  
- **Database:** MongoDB Cluster  
- **API Methods:** `GET`, `POST`, `DELETE`  

**Functionality:**
- Create, update, and delete calendar events  
- Sync calendar events based on lab data from the backend

---

### User Progress Management Microservice

- **Backend:** FastAPI  
- **Endpoints for:**
  - Managing users
  - Managing labs
  - Tracking user progress  
- **Supports:** `POST`, `GET`, and `DELETE` operations  

**Role:**
- Tracks user activity and lab creation/deletion

---

## Integration Mechanism

Communication between the two services is done via inter-service HTTP APIs.

**Sync Logic:**
- When a lab is added or deleted:
  - The Calendar Microservice makes a `GET /labs/` request to the User Progress Management Microservice
  - It compares the updated labs list with its local event data
  - **Adds** new labs as calendar events
  - **Deletes** removed labs from the calendar database

---

## In-Depth Behavior

- The **Calendar Microservice** provides a user-friendly interface for managing events.
  - Built using React + JavaScript
  - Exposes RESTful API endpoints (`GET`, `POST`, `DELETE`)
  - Stores all event data in a scalable MongoDB cluster

- The **User Progress Management Microservice** is designed for managing users and labs.
  - Developed with FastAPI
  - Handles create, retrieve, and delete operations
  - Enables seamless tracking of lab-related activity

- Inter-service synchronization ensures the calendar reflects all current labs.
  - Calendar fetches the `/labs/` list
  - **New labs** → Added to the calendar  
  - **Deleted labs** → Removed from the calendar


#### Setup and Run Instructions
1. Open terminals in the respective microservice folders and in both the terminals run the following commands:
```bash
docker-compose build
docker-compose up -d
```
2. Open the Calendar microservice at [localhost:3000](http://localhost:3000/) and User progress management service at [localhost:8004/](http://localhost:8004/docs#/default)
3. Open  ```http://localhost:8004/labs``` to fetch the labs created.
4. Use the ```localhost:3000/``` to see the GUI version of the calendar.
5. Use the ```localhost:5000/api/events``` to find the lab events added to the calendar database.
6. Once completed using you can stop the containers by running the following command in both terminals:
```bash
docker-compose down
```
