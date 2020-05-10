# Laboratory 8 Bookmarks App Modified 
## Created by Carlos Tamez Ayala
### Server side API with CRUD Methods
In the this server side aplication, I used the following structure for each bookmark: 
```
    const post = {
        id: uuid.v4(),
        title: string,
        description: string,
        url: string,
        rating: number
    }
```
I used the uuid for the creation of the id of each bookmark. In total 5 endpoints were created with a middleware to authorize each of them.

The middleware have three ways to authorize the usage of the endpoints sending the API Token to: 
* Authorization Bearer Token.
* **'book-api-key'** Header.
* **apiKey** in Params.

The model and the connection to Mongo was implmented on this project.

