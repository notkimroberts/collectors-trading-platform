exports.seed = (knex) => {
 /* const collectible = knex('collectible')
    .del()
    .then(() => {
        return knex('collectible').insert([
            { collectible_id: 1, name: 'test', image_url: 'google.com', attributes: { color: 'green', style: 'cool' }, total_quantity: 445 },
            { collectible_id: 2, name: 'test', image_url: 'google.com', attributes: { color: 'green', style: 'cool' }, total_quantity: 445 },
            { collectible_id: 3, name: 'test', image_url: 'google.com', attributes: { color: 'green', style: 'cool' }, total_quantity: 445 },
        ]);
    });
*/
    const collector = knex('collector')
    .del()
    .then(() => {
        return knex('collector').insert([
<<<<<<< HEAD
<<<<<<< HEAD
            { collector_id: 1, username: 'user1', password: 'password1', email: 'test1@gmail.com', phone_number: '1111111' },
            { collector_id: 2, username: 'user2', password: 'password2', email: 'test2@gmail.com', phone_number: '2222222' },
            { collector_id: 3, username: 'user3', password: 'password3', email: 'test3@gmail.com', phone_number: '3333333' },
=======
            { collector_id: 1, username: 'test1', password: 'Pword123', contact_email: 'test1@gmail.com', phone_number: '1234567' },
            { collector_id: 2, username: 'test2', password: 'Pword125', contact_email: 'test1@gmail.com', phone_number: '223231' },
            { collector_id: 3, username: 'test3', password: 'Pword12111', contact_email: 'test1@gmail.co.uk', phone_number: '1222-43334567' },
>>>>>>> c4feef0... login and register
=======
            { collector_id: 1, username: 'test1', password: 'Pword123', email: 'test1@gmail.com', contact_email: 'test1@gmail.com', phone_number: '1234567', is_admin: false  }
>>>>>>> 4a89928... login and register
        ]);
    });




    return Promise.all([
<<<<<<< HEAD
        collectible,
<<<<<<< HEAD
        collectector,
=======
=======
        //collectible,
>>>>>>> 4a89928... login and register
        collector,
>>>>>>> c4feef0... login and register
    ])
}

/*
exports.seed = (knex, Promise) => {
    return knex.raw('DELETE FROM "user"; ALTER SEQUENCE user_id_seq RESTART WITH 3')
    .then(() => {
        return knex('user').insert([
            {
                id: 1,
                email: 'berto.ort@gmail.com',
                password: 'pineapple',
                created_at: new Date()
            },
            {
                id: 2,
                email: 'hello@cjr.co.de',
                password: 'keyboard_cat',
                created_at: new Date()
            }
        ]);
    });

    }
    */