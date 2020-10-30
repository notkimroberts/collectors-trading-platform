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
10. Visit [localhost:3000](localhost:3000/)
11. Visit [localhost:3000/collectible](localhost:3000/collectible) and you should see:

```
{
  "data": [
    {
      "collectible_id": "30617",
      "collectible_type_id": "22810",
      "name": "lego",
      "image_url": "http://placeimg.com/640/480",
      "imagebytea": null,
      "attributes": {
        "type_name": "lego",
        "attributes": {
          "name": "The Clone Wars Republic Attack Gunship",
          "theme": "Star Wars",
          "set_number": 7676,
          "designed_by": "Adam Grabowski",
          "piece_count": 1050
        }
      },
      "total_quantity": "39593",
      "created_at": "2020-10-30T09:05:18.216Z",
      "updated_at": "2020-10-30T09:35:29.954Z"
    },
    {
      "collectible_id": "61108",
      "collectible_type_id": "8923",
      "name": "lego",
      "image_url": "http://placeimg.com/640/480",
      "imagebytea": null,
      "attributes": {
        "type_name": "lego",
        "attributes": {
          "name": "The Clone Wars Republic Attack Gunship",
          "theme": "Star Wars",
          "set_number": 7676,
          "designed_by": "Adam Grabowski",
          "piece_count": 1050
        }
      },
      "total_quantity": "26854",
      "created_at": "2020-10-30T08:17:33.840Z",
      "updated_at": "2020-10-30T12:16:19.432Z"
    },
    {
      "collectible_id": "33687",
      "collectible_type_id": "79122",
      "name": "lego",
      "image_url": "http://placeimg.com/640/480",
      "imagebytea": null,
      "attributes": {
        "type_name": "lego",
        "attributes": {
          "name": "The Clone Wars Republic Attack Gunship",
          "theme": "Star Wars",
          "set_number": 7676,
          "designed_by": "Adam Grabowski",
          "piece_count": 1050
        }
      },
      "total_quantity": "13324",
      "created_at": "2020-10-30T06:36:34.684Z",
      "updated_at": "2020-10-31T03:16:13.256Z"
    },
    ...
  ],
  "total": 500
}
```
## Quiz Questions

1. What types of links can I send other users?
2. After agreeing upon a trade, how many days do I get to send my package to the other party?
3. Before a trade can be agreed upon, which of the below must be done?
4. What is the first thing you should you do if you have not received your end of the trade?

## Quiz Solutions

1. None of the above
2. 3 business days
3. Have a PayPal account
4. Check the tracking number to see where your package may be