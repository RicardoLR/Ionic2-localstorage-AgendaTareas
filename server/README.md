

```bash
$ npm install
```

Start Server

```bash
$ npm start --watch db.json
```

Now if you go to [http://localhost:3000/lists/1](), you'll get

```json
{ id: 1, name: "test list" }
```


## Routes

Based on the previous `db.json` file, here are all the default routes. 


```
GET    /lists
GET    /lists/1
GET    /lists/1/todos
POST   /lists
PUT    /lists/1
PATCH  /lists/1
DELETE /lists/1

GET    /todos
GET    /todos/1
PUT    /todos/1
PATCH  /todos/1
DELETE /todos/1

¿POST   /todos?
```

### Database

```
GET /db
```

### Homepage

Returns default index file or serves `./public` directory

```
GET /
```


### Alternative port

You can start JSON Server on other ports with the `--port` flag:

```bash
$ json-server --watch db.json --port 3004
```
