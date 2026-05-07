import { faker } from '@faker-js/faker';
import * as bcrypt from 'bcrypt';

export async function seedUser(database: any, amount: number) {
  const baseData = database.create([
    {
      name: 'user',
      identificationNumber: 1,
      avatarUrl:
        'https://www.google.com/url?sa=i&url=https%3A%2F%2Fen.wikipedia.org%2Fwiki%2FImage&psig=AOvVaw2rdIEmYJIopIy15lIXC2ep&ust=1686907378637000&source=images&cd=vfe&ved=0CA4QjRxqFwoTCIjGtuv5xP8CFQAAAAAdAAAAABAE',
      account: 'user',
      CCCD: 'ABC123DEF456',
      phoneNumber: '84123456789',
      birthday: '2000-06-15',
      email: 'admin@gmail.com',
      address: 'user address',
      password: await bcrypt.hashSync('123456', 10),
    },
  ]);
  await database.save(baseData);

  const userArr = [];
  for (let i = 0; i < amount; i++) {
    const name = `${faker.person.firstName()}`;
    const email = `${faker.internet.email()}`;
    const random = Math.floor(Math.random() * 10);
    const user = {
      name: name,
      identificationNumber: Number(i + 2),
      avatarUrl: `${faker.image.url()}`,
      account: random % 2 == 0 ? name : email,
      CCCD: `${faker.string.alphanumeric(11)}`,
      phoneNumber: `${faker.string.numeric(10)}`,
      birthday: '2000-06-15',
      email: email,
      address: `${faker.person.firstName()} address`,
      password: await bcrypt.hashSync('123456', 10),
    };
    userArr.push(user);
  }
  const dataUser = database.create(userArr);
  await database.save(dataUser);
}
