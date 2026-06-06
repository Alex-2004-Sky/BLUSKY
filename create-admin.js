const { Client } = require('pg');

const client = new Client({
  connectionString: 'postgresql://neondb_owner:npg_r0sPgY6MNdxp@ep-dawn-dust-apytbkx9.c-7.us-east-1.aws.neon.tech/neondb?sslmode=require'
});

async function main() {
  await client.connect();
  await client.query(
    'INSERT INTO users (username, password_hash, role) VALUES ($1, $2, $3)',
    ['admin', '$2b$10$LHpSruRiUOc2UqUaWk9uvu/06r78iTZbE7.or7v.e71DFUNEgPuRu', 'admin']
  );
  console.log('✅ Admin user created successfully!');
  await client.end();
}

main().catch(e => { console.error('❌ Error:', e.message); client.end(); });
