exports.seed = (knex) => {
  const collectible = knex('collectible')
    .del()
    .then(() => {
        return knex('collectible').insert([
            { collectible_id: 1, name: 'test', image_url: 'google.com', attributes: { color: 'green', style: 'cool' }, total_quantity: 445 },
            { collectible_id: 2, name: 'test', image_url: 'google.com', attributes: { color: 'green', style: 'cool' }, total_quantity: 445 },
            { collectible_id: 3, name: 'test', image_url: 'google.com', attributes: { color: 'green', style: 'cool' }, total_quantity: 445 },
        ]);
    });

    const collectector = knex('collector')
    .del()
    .then(() => {
        return knex('collector').insert([
            { collector_id: 1, username: 'user1', password: 'password1', email: 'test1@gmail.com', phone_number: '1111111' },
            { collector_id: 2, username: 'user2', password: 'password2', email: 'test2@gmail.com', phone_number: '2222222' },
            { collector_id: 3, username: 'user3', password: 'password3', email: 'test3@gmail.com', phone_number: '3333333' },
        ]);
    });

    return Promise.all([
        collectible,
        collectector,
    ])
}