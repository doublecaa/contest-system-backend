import { faker } from '@faker-js/faker';

export async function seedCompetition(database: any, amount: number) {
  const baseData = database.create([
    {
      categoryCompetitionId: 1,
      title: 'competition title',
      content: 'competition content',
      // startDateApply: `${new Date(new Date().getDate() + 1).toJSON}`,
      // endDateApply: `${new Date(new Date().getDate() + 2).toJSON}`,
      // startDateCompetition: `${new Date(new Date().getDate() + 3).toJSON}`,
      // endDateCompetition: `${new Date(new Date().getDate() + 4).toJSON}`,
      maxNumberApply: 100,
      currentNumberApply: 50,
      websiteUrl: 'https://www.google.com',
      // rules: '1;3;2;4;5',
      // questions: '2;4;3;5;6',
      // polls: '2;4;3;5;6',
      // prizes: '1;2;5;7',
    },
  ]);
  await database.save(baseData);
  //
  const competitionArr = [];
  for (let i = 0; i < amount; i++) {
    const competition = {
      categoryCompetitionId: Number(faker.number.int({ min: 1, max: 10 })),
      title: `${faker.person.firstName()}`,
      content: `content ${faker.person.firstName()}`,
      // startDateApply: `${faker.date.recent()}`,
      // endDateApply: `${faker.date.recent()}`,
      // startDateCompetition: `${faker.date.recent()}`,
      // endDateCompetition: `${faker.date.recent()}`,
      maxNumberApply: Number(faker.number.int({ min: 50, max: 100 })),
      currentNumberApply: Number(faker.number.int({ min: 0, max: 100 })),
      websiteUrl: `${faker.image.url()}`,
      // rules: '1;3;2;4;5',
      // questions: '2;4;3;5;6',
      // polls: '2;4;3;5;6',
      // prizes: '1;2;5;7',
    };
    competitionArr.push(competition);
  }
  const dataCompetition = database.create(competitionArr);
  await database.save(dataCompetition);
}
