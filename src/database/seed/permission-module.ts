export async function seedPermissionModule(database: any) {
  const baseData = database.create([
    {
      code: 'admin',
      description: 'admin',
    },
    {
      code: 'banner',
      description: 'banner',
    },
    {
      code: 'candidate',
      description: 'candidate',
    },
    {
      code: 'competition',
      description: 'competition',
    },
    {
      code: 'permission-action',
      description: 'permission-action',
    },
    {
      code: 'permission-module',
      description: 'permission-module',
    },
    {
      code: 'result',
      description: 'result',
    },
    {
      code: 'role',
      description: 'role',
    },
    {
      code: 'user',
      description: 'user',
    },
    {
      code: 'request-update',
      description: 'request-update',
    },
  ]);
  await database.save(baseData);
}
