# Identity Reconciliation Service

This project is a simple service for handling identity reconciliation using TypeORM and Express.

## Verify the Endpoint

You can verify the endpoint yourself by visiting the following link:

[Verify Endpoint](https://your-endpoint-url.com)

## Getting Started

Follow these instructions to set up and run the project on your local machine.

### Prerequisites

Make sure you have the following installed on your machine:

- [Node.js](https://nodejs.org/) (version 22.x)
- [npm](https://www.npmjs.com/) (version 10.x or later)
- [PostgreSQL](https://www.postgresql.org/)

### Cloning the Repository

1. Clone the repository to your local machine using the following command:

```sh
git clone https://github.com/your-username/your-repo.git
```

2. Navigate into the project directory:

```sh
cd your-repo
```

### Running the Project Locally

1. Install the project dependencies using npm or Yarn:

```sh
npm install
```

2. Create a PostgreSQL database named `identity_reconciliation` for the project.

3. Add the following environment variables in your system or replace them in `config/default.json`:

```env
PGDB_HOST=localhost
PGDB_PORT=5432
PGDB_USERNAME=your-username
PGDB_PASSWORD=your-password
```

4. Start the development server:

```sh
npm start
```

5. The server should now be running at `http://localhost:8081` and can test the `/identity` endpoint with postman.

### API Documentation

#### Endpoint: `/api/identity`

- **Method**: `POST`
- **Description**: Finds or creates a contact based on the provided phone number and/or email.
- **Request Body**:

  ```json
  {
    "phoneNumber": "string",
    "email": "string"
  }
  ```

- **Response**:

  ```json
  {
    "contact": {
      "primaryContactId": "number",
      "emails": ["string"],
      "phoneNumbers": ["string"],
      "secondaryContactIds": ["number"]
    }
  }
  ```
