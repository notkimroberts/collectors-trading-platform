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
    const collectible_type = knex('collectible')
    .del()
    .then(() => {
        return knex('collectible').insert([
            { collectible_type_id: 1, name: 'test', release_year: 1000},
            { collectible_type_id: 2, name: 'test', release_year: 2000},
            { collectible_type_id: 3, name: 'test', release_year: 3000},
        ]);
    });
    return Promise.all([
        collectible, collectible_type,
    ])
   
}