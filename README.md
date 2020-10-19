# Collector's Trading Platform

## Development Setup

1. Clone repository: `git clone https://github.com/notkimroberts/collectors-trading-platform.git`
2. `cd collectors-trading-platform`
3. Install knex globally: `npm i knex -g`
4. Install application dependencies: `npm install`
5. Set heroku remote: `heroku git:remote -a collectors-trading-platform`
6. Login to heroku: `heroku login` and then walk through their steps.
7. Run database migrations: `heroku run npm run migrate`
8. Run database seed: `heroku run npm run seed`
9. Start server: `npm start`
10. Visit [localhost:3000](localhost:3000) and you should see:

```
Welcome to Collector's Trading Platform
```

10. Visit [localhost:3000/collectible](localhost:3000/collectible) and you should see:

<-COPY AND PASTE ALL BELOW INTO TERMINAL TO GET ALL RUNNING-> heroku git:remote -a collectors-trading-platform heroku login heroku run npm run migrate heroku run npm run seed npm start
```

{
  "data": [
    {
      "collectible_id": "1",
      "collectible_type_id": null,
      "name": "test",
      "image_url": "google.com",
      "attributes": {
        "color": "green",
        "style": "cool"
      },
      "total_quantity": "445",
      "created_at": "2020-10-17T16:39:25.718Z",
      "updated_at": "2020-10-17T16:39:25.718Z"
    },
    {
      "collectible_id": "2",
      "collectible_type_id": null,
      "name": "test",
      "image_url": "google.com",
      "attributes": {
        "color": "green",
        "style": "cool"
      },
      "total_quantity": "445",
      "created_at": "2020-10-17T16:39:25.718Z",
      "updated_at": "2020-10-17T16:39:25.718Z"
    },
    {
      "collectible_id": "3",
      "collectible_type_id": null,
      "name": "test",
      "image_url": "google.com",
      "attributes": {
        "color": "green",
        "style": "cool"
      },
      "total_quantity": "445",
      "created_at": "2020-10-17T16:39:25.718Z",
      "updated_at": "2020-10-17T16:39:25.718Z"
    }
  ],
  "total": 3
}
```
