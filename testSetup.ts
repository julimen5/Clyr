// testSetup.ts
import { createConnection } from 'mysql2';

afterAll(async () => {
  const connection = createConnection({
    uri: 'mysql://root:root@localhost:33061',
  });

  try {
    await connection.promise().query('DROP DATABASE IF EXISTS `Clyr-test`;');
    console.log('SQL script executed successfully to destroy the database.');
  } finally {
    connection.end();
  }
});
