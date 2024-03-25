# SpaceTravel
SoftUni Angular April 2024 Project Defence

##Introduction
SpaceTravel is application for Space Travel between planets. You can register,make posts,like,comment and download amazing planet photos from all over the universe.

## Short Features
Register,Login,LogOut,Home with last 3 Posts,Add,Dashboard,Edit,Delete,Profile with likes & created Posts,Search,Upload user photo or Upload post image,Like,Comment,Download Image,404 page,About

## Long Features
The main feature of the application is fully working CRUD operations with image files.

### Home page - displays the last three trips from the database.
### Trips page - Catalogue that displays all Trips from the database in separate pages.
### About page - Brief documentaton about the application.
### Sign In/UP button - shows Register and Login forms.
### Search bar - shows search input to find all matches in the database by trip name.
### Add Trip - Logged in users can upload an image and create trip.
### Profile page:
- dispalys the User info and all user's trips.
- Edit Profile - Logged in users can edit their username, email and upload new avatar.
### Trip Details page:
- shows detailed information and all comments about the log.
- Loged in users can like, post comments and download the log image.
- The creator of the log can post comments, download the log image, edit the log info and delete the log.
### 404 page - Animated page, that pops up when there is no matching route.



## How to use?
0.Download the repository and extract it to folder

1.Setup Server:
1.1.Open "server" folder with Visual Studio Code
1.2.In Terminal type: npm i 
(if there are old packages update them by updating package.json,removing package-lock,removing node_modules and npm i command again )
1.3.In Terminal to start the Server type: npm start


2.Setup Client:
2.1.Open "client" folder with Visual Studio Code(you need 2 diffrent visual studio code windows to be opened(server and client))
2.2.In Terminal type: npm i 
(if there are old packages update them by updating package.json,removing package-lock,removing node_modules and npm i command again )
2.3.If there are some errors somehow type in Terminal: ng build
2.4.In Terminal to start the client type: ng serve
2.5.Open: http://localhost:4200/
2.6.Enjoy

## Used libraries:
    - `nodemon` - automaticaly restarts the server during development.
    - `bcrypt`, `cookie-parser`, `jsonwebtoken` - for authentication and authorizaton.
    - `express-validator` - for data validation.
    - `moment` for date manipulation.
    - `mongoose` - for easily working with mongoDB.
    - `multer` - middleware for file storing & file uploads.

## Database

MongoDB with Mongoose is used for storing & managing the data.

## Unit Tests Added for project testing
