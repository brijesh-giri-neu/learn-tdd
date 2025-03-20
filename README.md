# JEST tutorial for test-driven development
Learn how to write unit tests and other kinds of tests

# Setup

Install dependencies

`$ npm install`

Run tests

`$ NODE_ENV=test npx jest /path/to/test/file`

Run coverage

`$ NODE_ENV=test npx jest --coverage /path/to/test/file`

View coverage report in `coverage/lcov-report/index.html`

The followung database scripts are not necessary. If you still need
them for manual testing here they are:

`$ npx ts-node insert_sample_data.ts "mongodb://127.0.0.1:27017/my_library_db"`

Clean the database

`npx ts-node remove_db.ts "mongodb://127.0.0.1:27017/my_library_db"`

# Description

This repository illustrates how to use jest to write unit tests 
for a server in typescript. The examples are as follows:

- `tests/authorSchema.test.ts`: Unit tests to verify the schema of the authors colletion. 
- `tests/bookDetailsService.test.ts`: Unit tests to verify the behavior of the service that is used to retrieve the details of a particular book.
- `tests/createBookService.test.ts`: Unit tests to verify if a book is created successfully.

# For you to do

## Part 1

Write a unit test for the GET /authors service. 
The service should respond with a list of author names and lifetimes sorted by family name of the authors. It should respond
with a "No authors found" message when there are no authors in the database. If an error occurs when retrieving the authors then the
service responds with an error code of 500. The unit test
should be placed in `tests/authorService.test.ts`.

## Part 2

Briefly explain a limitation of the tests in `tests/authorSchema.test.ts` in the space below.

- One main limitation of tests/authorSchema.test.ts is that the static methods (getAuthorCount, getAllAuthors, getAuthorIdByName) are not actually being tested because the internal MongoDB methods (countDocuments, findOne, find) are fully mocked using Jest. Since these mocks return predefined values without executing real database queries, the tests only verify that the mocked function was called with expected parameters. The tests don’t check if the actual database queries work correctly. For example, the getAuthorCount test will pass no matter what because countDocuments is hardcoded to return a fixed number. This means we’re not verifying if the method handles real database constraints, filters, or sorting properly, it just verifies that the mock returns what we expect.
- Our tests do not confirm whether:
  - The actual MongoDB queries are correct.
  - The database constraints (e.g., unique indexes, query filters, sorting) work.
  - The Mongoose middleware, hooks, and error handling work.
- In order to make the tests more meaningful, we should use an in-memory MongoDB database like mongodb-memory-server to test against a real database by executing actual queries. Doing this will confirm the above points by testing against an actual database.

## Part 3

Generate the coverage report for the tests you wrote. How can you improve
your tests using the coverage report? Briefly explain your 
process in the space below.