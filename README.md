# Issues tracker

## Setup, installing and running application

To setup init data for application open a command line and run following commands:

```
mongo.exe ~project root~/scripts/loadData.js
```

Make sure that mongo.exe is present in environment variables on system.
Script will add three user to the database:

-   admin1@test.com - test1234 // password
-   user1@test.com - test1234 // password
-   user2@test.com - test1234 // password

To start application in development navigate to root of the project and run commands:

```
npm install
npm run start
```

This commands will run node server on port 4000.

After that navigate to folder _project-root/src/client_ and run commands:

```
npm install
npm run start
```

Commands will install client dependencies and run dev server on port 3000.
Dev server will proxy all request from client applcation to back-end server on port 4000.

Access application using URL http://localhost:3000/.

Running application in production mode is not implemented.
