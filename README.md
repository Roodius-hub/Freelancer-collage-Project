###
Objectives of the Project
The main objective of this project is to develop a Real-Time Freelance Marketplace System that connects clients and freelancers through a secure and interactive web platform.
Main Features


Job posting and bidding system


Real-time bidding using WebSockets


Smart freelancer matching system


Secure authentication with NextAuth and JWT


Real-time chat between clients and freelancers


Project tracking dashboard


Review and rating system


Admin panel for platform management


Scalable, secure, and user-friendly design


## Project Setup

Follow the steps below to set up and run the project locally.

Prerequisites

Make sure the following tools are installed on your system:

Node.js ,
npm or yarn or bun ,
PostgreSQL ( PrismaORM ) ,
Git

## Installation

Clone the repository

```git clone <repository-url> && cd project-name ```

### Install dependencies

```bun install```

### Configure environment variables

Create a .env file in the root directory and add the required environment variables:

``` 

DATABASE_URL="DATABASE_URL="postgresql://postgres:password@localhost:5432/mydb?schema=public"
NEXTAUTH_SECRET=your_secret_key
NEXTAUTH_URL=http://localhost:3000
JWT_SECRET=your_jwt_secret
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GITHUB_CLIENT_SECRET=
GITHUB_CLIENT_ID= 

```

Run the development server
bun run dev

Open the application

Visit:

http://localhost:3000

Run  Docker Container : 
        ```docker run --name some-postgres -e POSTGRES_PASSWORD=mysecretpassword -e POSTGRES_DB=mydb -d -p 5432:5432     postgres```

Connection String :
        ``` DATABASE_URL="postgresql://postgres:password@localhost:5432/mydb?schema=public" ```

