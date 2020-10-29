const knex = require('../connection')

module.exports = {
    /*
    createCollectible: (name, image_url, total_quantity) => {
        const collectible = knex('collectible')
        .then(() => {
            return knex('collector').insert([
                { name: name, image_url: image_url, total_quantity: total_quantity },
            ])
        })
        return Promise.all([collectible])
      },
     */
    getOne: function (collectible_id) {
        return knex('collectible').where('collectible_id', collectible_id).first();
      },
    
    getOneByImage: function (collectible_id) {
        return knex('collectible').where('collectible_id', collectible_id).first();
      },
      getOneByName: function (name) {
        return knex('collectible').where('name', name).first();
      },
          
      create: function(collectible) {
        return knex('collectible').insert(collectible, 'collectible_id').then(ids => {
          return ids[0];
        });
      }
}
