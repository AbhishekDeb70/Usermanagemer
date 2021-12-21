// Update with your config settings.

module.exports = {
  development: {
    client: 'mysql',
    connection: {
      database: 'log',
      user:     'root',
      password: 'R@ils'
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  },

};
