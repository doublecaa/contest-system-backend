import { DataSource } from 'typeorm';


export async function resetDatabase(dataSource: DataSource) {
  const entities = dataSource.entityMetadatas;

  // disable FK
  for (const entity of entities) {
    const tableName = entity.tableName;
    await dataSource.query(`ALTER TABLE [${tableName}] NOCHECK CONSTRAINT ALL`);
  }

  // delete data
  for (const entity of entities) {
    const tableName = entity.tableName;
    await dataSource.query(`DELETE FROM [${tableName}]`);
  }

  // reset identity
  for (const entity of entities) {
    const tableName = entity.tableName;
    await dataSource.query(`DBCC CHECKIDENT ('${tableName}', RESEED, 0)`);
  }

  // enable FK
  for (const entity of entities) {
    const tableName = entity.tableName;
    await dataSource.query(`ALTER TABLE [${tableName}] CHECK CONSTRAINT ALL`);
  }
}