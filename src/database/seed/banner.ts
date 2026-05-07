import { faker } from '@faker-js/faker';

export async function seedBanner(database: any, amount: number) {
  const baseData = database.create([
    {
      competitionId: 1,
      gioiThieuHeaderUrl:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRJzMNWNPsA8KiUFY_YiEC7rub3JEDOCUXXHwJ40dp7&s',
      mobileGioiThieuHeaderUrl:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRJzMNWNPsA8KiUFY_YiEC7rub3JEDOCUXXHwJ40dp7&s',
      redirectGioiThieuHeaderUrl: 'https://www.google.com',
      contentGioiThieuHeader: 'contentGioiThieuHeader',
      gioiThieuFooterUrl:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRJzMNWNPsA8KiUFY_YiEC7rub3JEDOCUXXHwJ40dp7&s',
      mobileGioiThieuFooterUrl:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRJzMNWNPsA8KiUFY_YiEC7rub3JEDOCUXXHwJ40dp7&s',
      redirectGioiThieuFooterUrl: 'https://www.google.com',
      contentGioiThieuFooter: 'contentGioiThieuFooter',
    },
  ]);
  await database.save(baseData);
  //
  const bannerArr = [];
  for (let i = 0; i < amount - 1; i++) {
    const banner = {
      competitionId: i + 2,
      gioiThieuHeaderUrl: `${faker.image.url()}`,
      mobileGioiThieuHeaderUrl: `${faker.image.url()}`,
      redirectGioiThieuHeaderUrl: `${faker.image.url()}`,
      contentGioiThieuHeader: 'contentGioiThieuHeader',
      gioiThieuFooterUrl: `${faker.image.url()}`,
      mobileGioiThieuFooterUrl: `${faker.image.url()}`,
      redirectGioiThieuFooterUrl: `${faker.image.url()}`,
      contentGioiThieuFooter: 'contentGioiThieuFooter',
    };
    bannerArr.push(banner);
  }
  const dataBanner = database.create(bannerArr);
  await database.save(dataBanner);
}
