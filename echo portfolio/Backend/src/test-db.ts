import { Client } from 'pg';
async function test(url: string) {
  const client = new Client({ connectionString: url });
  try {
    await client.connect();
    console.log('Connected to ' + url);
    await client.end();
  } catch (e: any) {
    console.log('Failed connecting to ' + url + ' Error: ' + e.message);
  }
}
async function run() {
  await test('postgres://postgres:root@localhost:6000/postgres');
  await test('postgres://root:root@localhost:6000/postgres');
  await test('postgres://admin:root@localhost:6000/postgres');
  await test('postgres://postgres:root@localhost:5432/postgres');
}
run();
