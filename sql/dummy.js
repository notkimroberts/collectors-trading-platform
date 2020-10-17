// TODO: add a generate all table data method that accounts for foreign keys.
const faker = require('faker');
const lego = require('../templates/lego')


class SchemaData {
    constructor() {
        this.collector_id = null;
        this.follower_id = null;
        this.to_collector_id = null;
        this.collectible_id = null;
        this.collectible_type_id = null;
        this.release_year = null;
        this.total_quantity = null;
    }

    static getRandomInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    generateRandomKeysAndValues() {
        this.collector_id = SchemaData.getRandomInt(1, 50)
        this.follower_id = SchemaData.getRandomInt(51, 100)
        this.collectible_id = SchemaData.getRandomInt(3, 7)
        this.collectible_type_id = 1
        this.release_year = 2020
        this.total_quantity = SchemaData.getRandomInt(100, 1000)
        this.to_collector_id = SchemaData.getRandomInt(100, 200)
    }

    getCollectible() {
        return {
            collectible_id: this.collectible_id,
            collectible_type_id: this.collectible_type_id,
            name: 'lego',
            image_url: faker.image.imageUrl(),
            attributes: lego,
            total_quantity: this.total_quantity,
            created_at: faker.date.soon(),
            updated_at: faker.date.soon(),
        }
    }

    getCollectibleType() {
        return {
            collectible_type_id: SchemaData.getRandomInt(1, 10),
            name: faker.lorem.word(),
            release_year: SchemaData.getRandomInt(1970, 2020),
            attribute_template: 'lego',
            created_at: faker.date.soon(),
            updated_at: faker.date.soon(),
        }
    }

    getCollection() {
        return {
            collector_id: this.collector_id,
            collection_id: this.collection_id,
            has_quantity: SchemaData.getRandomInt(10, 20),
            willing_to_trade_quantity: 1,
            wants_quantity: 1,
        }
    }

    getCollector() {
        return {
            collector_id: this.collector_id,
            is_admin: faker.random.boolean(),
            username: faker.lorem.word(),
            password: faker.internet.password(),
            created_at: faker.date.soon(),
            updated_at: faker.date.soon(),
            email: faker.internet.email(),
            contact_email: faker.internet.email(),
            phone_nmber: faker.phone.phoneNumber(),
            has_public: faker.random.boolean(),
            wants_public: faker.random.boolean(),
        }
    }

    getCollectorRatings() {
        return {
            from_user_id: this.collector_id,
            to_user_id: this.follower_id,
            rating: SchemaData.getRandomInt(5),
            created_at: faker.date.soon(),
            updated_at: faker.date.soon(),
        }
    }

    getFollower() {
        return {
            collector_id: this.collector_id,
            following_collector_id: this.follower_id,
        }
    }

    getMatch() {
        return {
            match_id: SchemaData.getRandomInt(1, 1000),
            from_collector_id: this.collector_id,
            to_collector_id: this.to_collector_id,
            collectible_id: this.collectible_id,
            created_at: faker.date.soon(),
            match_exectuted: faker.random.boolean(),
        }
    }

    generateData() {
        console.log('gen')
    }
}