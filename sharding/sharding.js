// Sharding Logic
const { error } = require('console');
const { Client } = require('pg'); // Import PostgreSQL client



const getShardIndex = (key) =>{
    // Hash the key
    const hash = require('crypto').createHash('md5').update(key).digest('hex');
    return parseInt(hash, 16) % DataNodes.length; // return the shard index
}


// Test CLients, will be dynamic later.
const pgClients = [

    new Client ({
        user: 'admin',
        host: 'localhost',
        database: 'shard1',
        password: 'admin123',
        port: '5432'
    }),
    new Client ({
        user: 'admin',
        host: 'localhost',
        database: 'shard1',
        password: 'admin123',
        port: '5433'
    })

];
// Connect to each Client and Create a table for the data
pgClients.forEach(client =>{
    client.connect()
    .then(() => console.log(`Connected to PostgreSQL on ${client.database}`))
    .then(() => client.query(`
        CREATE TABLE IF NOT EXISTS key_value_store (
            key VARCHAR(255) PRIMARY KEY, 
            value TEXT
        )
        `))
    .catch(() => console.log('Connection Error', err.stack));
})


module.exports = {
    pgClients,
    getShardIndex,
};