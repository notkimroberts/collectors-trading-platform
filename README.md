# Collector's Trading Platform

## Development Setup

1. Clone repository: `git clone https://github.com/notkimroberts/collectors-trading-platform.git`
2. `cd collectors-trading-platform`
3. Install knex globally: `npm i knex -g`
4. Install application dependencies: `npm install`
5. Create a local postgres database: `createdb ctp` (or your preferred way of creating a database)
6. Run database migrations: `npm run migrate`
7. Run database seed: `npm run seed`
8. Start server: `npm start`
9. Visit [localhost:3000/](localhost:3000/) and you should see:

```
Hello, (Collector's Trading Platform) World!
Index
Welcome to Collector's Trading Platform
```

10. Visit [localhost:3000/todos](localhost:3000/todos) and you should see:

```
{
  "data": [
    {
      "id": 1,
      "task": "do this"
    },
    {
      "id": 2,
      "task": "then this"
    },
    {
      "id": 3,
      "task": "then this after that"
    }
  ],
  "total": 3
}
```
