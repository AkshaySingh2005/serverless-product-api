# Serverless API Project on AWS

This project is a serverless API built using AWS services including API Gateway, AWS Lambda, and DynamoDB. The API allows CRUD operations on a product database.

## Table of Contents
- [Architecture](#architecture)
- [AWS Services Used](#aws-services-used)
- [API Endpoints](#api-endpoints)
- [DynamoDB Table Structure](#dynamodb-table-structure)
- [Project Setup & Deployment](#project-setup--deployment)
- [Procedure & Implementation](#procedure--implementation)
- [Best Practices](#best-practices)

## Architecture
![Architecture](https://github.com/AkshaySingh2005/serverless-product-api/blob/main/img/Architecture.png)

## AWS Services Used
1. **API Gateway** - Manages HTTP requests and routes them to AWS Lambda functions, acting as the entry point to the API.
2. **AWS Lambda** - Executes backend business logic in a serverless environment, ensuring scalability and cost-efficiency.
3. **DynamoDB** - A fully managed NoSQL database service that stores and retrieves product data efficiently with high availability.
4. **IAM Roles** - Manages permissions for AWS Lambda functions, allowing them to securely interact with DynamoDB and API Gateway.

## API Endpoints
The following endpoints are available in the API:

![API Endpoints](https://github.com/AkshaySingh2005/serverless-product-api/blob/main/img/API%20Endpoints.png)

## DynamoDB Table Structure
The data is stored in a DynamoDB table with the following attributes:

![DynamoDB Table](https://github.com/AkshaySingh2005/serverless-product-api/blob/main/img/DynamoDB%20Table.png)


## Lambda function
The code is written here

![lambda function](https://github.com/AkshaySingh2005/serverless-product-api/blob/main/img/Lamdba%20function.png)

## Project Setup & Deployment
### Prerequisites
- AWS Account
- AWS CLI configured
- Node.js installed

### Steps
1. Clone the repository:
   ```sh
   git clone <repository-url>
   cd serverless-api
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Deploy using AWS SAM or Serverless Framework:
   ```sh
   serverless deploy
   ```

## Procedure & Implementation
This project was implemented following these steps:
1. **Setting Up API Gateway:** Created a new API Gateway instance and defined routes for various HTTP methods.
2. **Developing Lambda Functions:** Implemented Lambda functions to handle each API request, including creating, retrieving, updating, and deleting product data.
3. **Configuring DynamoDB:** Designed the table schema and configured access permissions for Lambda to interact with the database.
4. **Testing API Endpoints:** Used tools like Postman to verify that the API endpoints work as expected.
5. **Deploying the Project:** Used the Serverless Framework to automate deployment and configure necessary AWS services.

## Best Practices
- Use **environment variables** for configurations.
- Enable **CloudWatch logs** for debugging.
- Follow **least privilege principle** for IAM roles.
- Use **AWS SAM or Serverless Framework** for easier deployment.

---
**Author**: [Your Name]  
**License**: MIT  
**Date**: March 2025  
