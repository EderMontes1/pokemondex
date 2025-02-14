require('dotenv').config();
const { MongoClient } = require('mongodb');

const dbURL = process.env.MONGO_URI;

async function listDatabases() {
  const client = new MongoClient(dbURL);

  try {
    await client.connect();
    console.log('Conectado correctamente a MongoDB!');

    const admin = client.db().admin();
    const result = await admin.listDatabases();
    console.log('Bases de datos disponibles:', result.databases);
  } catch (error) {
    console.error('Error al listar bases de datos:', error);
  } finally {
    await client.close();
    console.log('Conexión cerrada.');
  }
}

listDatabases().catch(console.error);
