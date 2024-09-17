const mysql = require('mysql2');
const fs = require('fs');
const path = require('path');

afterAll(async () => {
  const connection = mysql.createConnection({
    uri: process.env.DATABASE_URL,
  });

  try {
    await connection.promise().query('DROP DATABASE IF EXISTS `Clyr-test`;');
    console.log('SQL script executed successfully to destroy the database.');
  } catch (error) {
    console.error('Failed to execute SQL script:', error);
  } finally {
    connection.end();
  }
});
