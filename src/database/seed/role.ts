import { faker } from '@faker-js/faker';

export async function seedRole(database: any, amount: number) {
  const baseData = database.create([
    {
      name: 'Director',
      description: 'Role Director description',
      permission:
        "[{'1':[1,2,3,4,5,6]},{'2':[1,2,3,4,5,6]},{'3':[1,2,3,4,5,6]},{'4':[1,2,3,4,5,6]},{'5':[1,2,3,4,5,6]},{'6':[1,2,3,4,5,6]},{'7':[1,2,3,4,5,6]},{'8':[1,2,3,4,5,6]},{'9':[1,2,3,4,5,6]},{'10':[1,2,3,4,5,6]}]",
    },
    {
      name: 'Competition',
      description: 'Role competition admin description',
      permission:
        "[{'1':[1,2,3,4,5,6]},{'4':[1,2,3,4,5]},{'10':[1,2,3,4,5]}]",
    },
  ]);
  await database.save(baseData);
  //
  const roleArr = [];
  for (let i = 0; i < amount; i++) {
    const role = {
      name: `${faker.person.jobTitle()}`,
      description: `${faker.finance.transactionDescription()}`,
      permission: "[{'1':[1,2,3,4,5,6]}]",
    };
    roleArr.push(role);
  }
  const dataRole = database.create(roleArr);
  await database.save(dataRole);
}
