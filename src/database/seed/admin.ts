import { faker } from '@faker-js/faker';
import * as bcrypt from 'bcrypt';

export async function seedAdmin(database: any, amount: number) {
  const baseData = database.create([
    {
      name: 'admin',
      email: 'admin@gmail.com',
      roleId: 1,
      password: await bcrypt.hashSync('12345678', 10),
    },
    {
      name: 'admin competition',
      email: 'admin_competition@gmail.com',
      roleId: 2,
      password: await bcrypt.hashSync('12345678', 10),
    },
  ]);
  await database.save(baseData);
  //
  const adminArr = [];
  for (let i = 0; i < amount; i++) {
    const email = `${faker.internet.email()}`;
    const accountDomain = email.split('@')[0];
    const admin = {
      name: `${faker.person.firstName()}`,
      accountDomain: accountDomain,
      email: email,
      password: await bcrypt.hashSync('12345678', 10),
      roleId: Number(faker.number.int({ min: 1, max: 10 })),
    };
    adminArr.push(admin);
  }
  const dataAdmin = database.create(adminArr);
  await database.save(dataAdmin);
}
