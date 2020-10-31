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
        const userID = faker.unique(faker.random.number)
        this.collector_id = userID
        this.follower_id = userID
        this.to_collector_id = userID
        this.collectible_id = faker.unique(faker.random.number)
        this.collectible_type_id = faker.unique(faker.random.number)
        this.release_year = 2020
        this.total_quantity = faker.unique(faker.random.number)
        this.match_id = faker.unique(faker.random.number)
    }

    getCollectible() {
        return {
            collectible_id: this.collectible_id,
            collectible_type_id: this.collectible_type_id,
            name: 'lego',
            image_url: faker.image.imageUrl(),
            attributes: JSON.stringify(lego),
            total_quantity: this.total_quantity,
            created_at: faker.date.soon(),
            updated_at: faker.date.soon(),
        }
    }

    getCollectibleType() {
        return {
            collectible_type_id: this.collectible_type_id,
            name: faker.lorem.word(),
            release_year: this.release_year,
            attribute_template: 'lego',
            created_at: faker.date.soon(),
            updated_at: faker.date.soon(),
        }
    }

    getCollection() {
        return {
            collector_id: this.collector_id,
            collectible_id: this.collectible_id,
            has_quantity: faker.random.number(),
            willing_to_trade_quantity: 1,
            wants_quantity: 1,
        }
    }

    getCollector() {
        return {
            collector_id: this.collector_id,
            username: faker.lorem.word(),
            password: faker.internet.password(),
            email: faker.internet.email(),
            phone_number: faker.phone.phoneNumber(),
            created_at: faker.date.soon(),
            updated_at: faker.date.soon(),
<<<<<<< HEAD
            email: faker.internet.email(),
            contact_email: faker.internet.email(),
            phone_nmber: faker.phone.phoneNumber(),
            facebook: faker.internet.facebook(),
            paypal_nmber: faker.internet.paypal_nmber(),
            has_public: faker.random.boolean(),
            wants_public: faker.random.boolean(),
=======
>>>>>>> 501c7f59138884cd197aa97b1857b1e0e813f159
        }
    }

    getCollectorRatings() {
        return {
            from_user_id: this.collector_id,
            to_user_id: this.follower_id,
            rating: SchemaData.getRandomInt(1, 5),
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
            match_id: this.match_id,
            from_collector_id: this.collector_id,
            to_collector_id: this.to_collector_id,
            collectible_id: this.collectible_id,
            match_executed: faker.random.boolean(),
            created_at: faker.date.soon(),
        }
    }
}

function createDummyRows(rows) {
    let collectibles = []
    let collectibleTypes = []
    let collections = []
    let collectors = []
    let collectorRatings = []
    let followers = []
    let matches = []

    const dummy = new SchemaData()

    for (let i = 0; i < rows; i++) {
        dummy.generateRandomKeysAndValues()
        const collectibleRow = dummy.getCollectible()
        const collectibleTypeRow = dummy.getCollectibleType()
        const collectionRow = dummy.getCollection()
        const collectorRow = dummy.getCollector()
        const collectorRatingRow = dummy.getCollectorRatings()
        const followerRow = dummy.getFollower()
        const matchRow = dummy.getMatch()

        collectibles.push(collectibleRow)
        collectibleTypes.push(collectibleTypeRow)
        collections.push(collectionRow)
        collectors.push(collectorRow)
        collectorRatings.push(collectorRatingRow)
        followers.push(followerRow)
        matches.push(matchRow)
    }

    return {
        collectors,
        collectibleTypes,
        collectibles,
        collections,
        collectorRatings,
        followers,
        matches,
    }
}

const { 
    collectors,
    collectibleTypes,
    collectibles,
    collections,
    collectorRatings,
    followers,
    matches,
} = createDummyRows(500)

module.exports = {
    collectors,
    collectibleTypes,
    collectibles,
    collections,
    collectorRatings,
    followers,
    matches,
}