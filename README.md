# Jamcloud-API
The jamcloud-api uses ExpressJS to
connect the Jamcloud client with the
 Jamcloud PostgreSQL database allowing users
  to create an account so that they can add to
   the growing list of jams. 
   In the future the database will also store ratings, 
   notes, and personalized lists linked to users.


##Links 

-  Backend Repo: www.github.com/bilbertius/jc-s
-  Frontend Repo: www.github.com/bilbertius/jamcloud-client
-  Live app:    www.jamcloud.now.sh



## Tech Stack 
### Front End:

- React

### Back End: 

- NodeJS 
- ExpressJS
- PostgreSQL

##Endpoints 

| Method | Path               | Description |
|--------| -------------------| -------------------|
| GET    | /songs             | get all songs in the database |
| POST   | /users/            | create a new user |
| GET    | /users/songs/${id} | get all songs posted by a user|
| DELETE | /songs             | delete a song from the users list |
| PATCH  | /songs             | update a listed song | 


## Screenshots 

- ![](src/images/image-one.png)
 ![](src/images/image-two.png)
- ![](src/images/image-three.png)
 ![](src/images/image-four.png)


  