export async function seedPermissionAction(database: any) {
  const baseData = database.create([
    {
      code: 'insert',
      description: 'insert',
    },
    {
      code: 'update',
      description: 'update',
    },
    {
      code: 'delete',
      description: 'delete',
    },
    {
      code: 'getList',
      description: 'getList',
    },
    {
      code: 'getDetails',
      description: 'getDetails',
    },
    {
      code: 'review',
      description: 'review',
    },
  ]);
  await database.save(baseData);
}
