Scripting - NodeJS
Framework - ExpressJS
DB - MongoDB

- mongoose used to connect with mongoBD
- files will be uploaded to uploads folder and file name will be saved within user record
- ----------------------------------------------

-.env variables
MONGO_URI=mongodb://localhost:27017/code-test(mongo URI)
API_PORT=4000 (application port)
encryption_key=123456(encryption used for password)
JWT_KEY=654321(secret key for JWT)

--------------------------------------------------------

files:

index.js - code related to server initialization
app.js - code related to business logic and all routes 
db.js - db connection logic
authentication.js - code related to authentication middleware
users.js - code related to data model of users collection

---------------------------------------------------------

routes: 

signup - http://localhost:4000/signup
signin - http://localhost:4000/signin
updated/edit - http://localhost:4000/updateuser

----------------------------------------------------------

Starting Application

run npm install once cloning is compelted

execute npm start after npm install

post man examples can be found in poat-man-screenshots folder for your reference

