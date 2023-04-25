<h1> API Documentation </h1>

Welcome to the documentation for the DATA PUSHER API.

<h2>  In the project directory, you can run: </h2>

 <h3> npm start </h3>

<!--? ADMIN OPERATIONS  -->

<!-- * CREATE ADMIN -->

HTTP METHOD : POST

URL : http://localhost:8000/admin/createAdmin

INPUT BODY : {
"username": "Gowtham",
"email": "admin@cl1.co",
"contact": 8072953226,
"designation":"Admin",
"password": "gowtham",
"conformPassword": "gowtham"
}

<!--? ADMIN LOGIN  -->

HTTP METHOD : POST

URL : http://localhost:8000/admin/adminLogin

INPUT BODY : {
"email": "admin@cl.co",
"password": "gowtham"
}

DESCRIPTION :

<!--? GET ALL USERS DATA  -->

HTTP METHOD : GET

URL : http://localhost:8000/admin/getAllUsers

INPUT HEADER : BEARER TOKEN

DESCRIPTION :

<!--? GET ALL USER DESTINATIONS  -->

HTTP METHOD : GET

URL : http://localhost:8000/admin/getAllDestinations

INPUT HEADER : BEARER TOKEN

DESCRIPTION :

<!--? DELETE INDIVIDUAL USER -->

HTTP METHOD : DEL

URL : http://localhost:8000/admin/deleteUser

INPUT HEADER : BEARER TOKEN

DESCRIPTION :

<!--! USER OPERATIONS  -->

<!--? CREATE USER  -->

HTTP METHOD : POST

URL : http://localhost:8000/user/createUser

INPUT BODY : {
"username": "Kumar",
"email": "vgk12345@gmail.com",
"contact": 9487991116,
"designation":"User",
"password": "gowtham",
"conformPassword": "gowtham"
}

DESCRIPTION :

<!--? LOGIN USER  -->

HTTP METHOD : POST

URL : http://localhost:8000/user/loginUser

INPUT BODY :{
"email": "vgk12345@gmail.com",
"password": "gowtham"
}

DESCRIPTION :

<!--? EDIT OWN USER DATA  -->

HTTP METHOD : PUT

URL : http://localhost:8000/user/editOwnData

INPUT HEADER : BEARER TOKEN

INPUT BODY :{
"username": "",
"email": "",
"contact": 0000000000,
"designation":"",
"password": "",
"conformPassword": ""
}

DESCRIPTION :

<!--? EDIT OWN USER DESTINATIONS  -->

HTTP METHOD : PUT

URL : http://localhost:8000/user/editOwnDestini/:id

INPUT HEADER : BEARER TOKEN

INPUT PARAMS : 0 / Number

INPUT BODY :{
"house": "",
"door": 0,
"street": ""
}

DESCRIPTION : AN ACCOUNT MAY CONTAIN MULTIPLE DESTINATIONS IT DOES'NT MATTER ABOUT QUANTITY OF DESTINATION OBJECTS , USING THIS API WE CAN EDIT THE SPECIFIC DESTINATIONS AMOUNG THEM.

<!--? CREATE USER DESTINATIONS  -->

HTTP METHOD : POST

URL : http://localhost:8000/user/createDestinations

INPUT HEADER : BEARER TOKEN

INPUT BODY : {
    "house": "new",
    "door": 1,
    "street": "new"
}

DESCRIPTION : IN THIS CASE IF USER HAS A EXISTING DESTINATION THEN UPCOMMING 
DESTINATION WILL BE ADD SECONDARY ONE (WON'T BE GET REPLACED BY NEW ONE).
