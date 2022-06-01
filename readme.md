# EdTech-Management API

> Backend API for EdTech-Management, which is a platform, Where Schools are registered, along with their Students.

## Usage

Rename "config/config.env.env" to "config/config.env" and update the values/settings to your own

## Install Dependencies

```
npm install
```

## Run App

```
# Run in dev mode
npm run dev

# Run in prod mode
npm start
```

## Database Seeder

To seed the database with users, schools and students with data from the "\_data" folder, run

```
# Destroy all data
node seeder -d

# Import all data
node seeder -i
```

# EdTech-Management Backend API Specifications

The backend for a school directory website. All of the functionality below are fully implmented in this project.

### Schools

- List all schools in the database
  - Pagination
  - Select specific fields in result
  - Limit number of results
  - Filter by fields
- Get single school
- Create new school
  - Authenticated users only
  - Must have the role "publisher" or "admin"
  - Only one school per publisher (admins can create more)
  - Field validation via Mongoose
- Update Schools
  - Owner only
  - Validation on update
- Delete School
  - Owner only

### Students

- List all students for school
- List all students in general
  - Pagination, filtering, etc
- Get single student
- Create new student
  - Authenticated users only
  - Must have the role "publisher" or "admin"
  - Only the owner or an admin can create a student for a school
  - Publishers can create multiple students
- Update student
  - Owner only
- Delete student
  - Owner only

### Users & Authentication

- Authentication will be ton using JWT/cookies
  - JWT and cookie should expire in 30 days
- User registration
  - Register as a "user" or "publisher"
  - Once registered, a token will be sent along with a cookie (token = xxx)
  - Passwords must be hashed
- User login
  - User can login with email and password
  - Plain text password will compare with stored hashed password
  - Once logged in, a token will be sent along with a cookie (token = xxx)
- User logout
  - Cookie will be sent to set token = none
- Get user
  - Route to get the currently logged in user (via token)
- Password reset (lost password)
  - User can request to reset password
  - A hashed token will be emailed to the users registered email address
  - A put request can be made to the generated url to reset password
  - The token will expire after 10 minutes
- Update user info
  - Authenticated user only
  - Separate route to update password
- User CRUD
  - Admin only
- Users can only be made admin by updating the database field manually

## Security

- Encrypt passwords and reset tokens
- Prevent NoSQL injections
- Add headers for security (helmet)
- Prevent cross site scripting - XSS
- Add a rate limit for requests of 100 requests per 10 minutes
- Protect against http param polution
- Use cors to make API public (for now)

## Code Related Suggestions / Refactoring

- NPM scripts for dev and production env
- Config file for important constants
- Use controller methods with documented descriptions/routes
- Error handling middleware
- Authentication middleware for protecting routes and setting user roles
- Validation using Mongoose and no external libraries
- Use async/await (create middleware to clean up controller methods)
- Create a database seeder to import and destroy data
