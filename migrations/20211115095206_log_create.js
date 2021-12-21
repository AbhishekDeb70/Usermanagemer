
exports.up = function(knex) {
    return knex.schema.createTable('log',table =>{
        table.increments('id');
        table.string('First_name').notNullable();
        table.string('Last_name').notNullable();
        table.string('email').notNullable().unique();
        table.string('phone').notNullable().unique();
        table.string('comments').notNullable();
    })
};

exports.down = function(knex) {
    return knex.schema.dropTable('log');
};
