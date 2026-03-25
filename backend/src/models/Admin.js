const mongoose = require('mongoose');
const adminSchema = require('./schema/adminSchema');

/**
 * Admin Model
 * Compiles the admin schema into a Mongoose model.
 */
const Admin = mongoose.model('Admin', adminSchema);

module.exports = Admin;
