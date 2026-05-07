import { DataSource } from 'typeorm';
import { Admin, Banner, Candidate, Competition, PermissionAction, PermissionModule, RequestUpdate, Role, User } from '../entities';
import { seedAdmin } from './admin';
import { seedPermissionAction } from './permission-action';
import { seedPermissionModule } from './permission-module';
import { seedRole } from './role';
import { seedCompetition } from './competition';
import { seedBanner } from './banner';
import { seedUser } from './user';
import { seedCandidate } from './candidate';
import { resetDatabase } from './resetDB';
import * as dotenv from 'dotenv';
dotenv.config();

const dataSource = new DataSource({
    type: 'mssql',
    host: process.env.DATABASE_HOST,
    port: Number(process.env.DATABASE_PORT),
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    entities: [
        Admin,
        Banner,
        Candidate,
        Competition,
        PermissionAction,
        PermissionModule,
        Role,
        User,
        RequestUpdate
    ],
    synchronize: true,
    extra: {
        encrypt: true,
        trustServerCertificate: true,
    },
});
dataSource.initialize().then(async () => {
    await resetDatabase(dataSource);
    await seedPermissionAction(dataSource.getRepository(PermissionAction));
    await seedPermissionModule(dataSource.getRepository(PermissionModule));
    await seedRole(dataSource.getRepository(Role), 10);
    await seedAdmin(dataSource.getRepository(Admin), 10);
    await seedCompetition(dataSource.getRepository(Competition), 10);
    await seedBanner(dataSource.getRepository(Banner), 10);
    await seedUser(dataSource.getRepository(User), 10);
    await seedCandidate(dataSource.getRepository(Candidate), 10);
    console.log('done');
}).catch((e) => {
    console.log('-----error', e)
})