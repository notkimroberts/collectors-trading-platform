// TODO: Sample seed data, to be deleted.
exports.seed = function(knex) {
  return knex('todo').del()
    .then(function () {
      return knex('todo').insert([
        { id: 1, task: 'do this' },
        { id: 2, task: 'then this' },
        { id: 3, task: 'then this after that' }
      ]);
    });
};
