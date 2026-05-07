import { faker } from '@faker-js/faker';

export async function seedCandidate(database: any, amount: number) {
  const baseData = database.create([
    {
      userId: 1,
      competitionId: 1,
      status: 0,
    },
  ]);
  await database.save(baseData);
  //
  const candidateArr = [];
  for (let i = 0; i < amount; i++) {
    const candidate = {
      userId: i + 2,
      competitionId: Number(faker.number.int({ min: 1, max: 10 })),
      status: Number(faker.number.int({ min: 1, max: 3 })),
    };
    candidateArr.push(candidate);
  }
  const dataCandidate = database.create(candidateArr);
  await database.save(dataCandidate);
}
