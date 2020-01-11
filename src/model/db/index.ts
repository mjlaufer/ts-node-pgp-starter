import dotenv from 'dotenv';
import pgPromise, { IInitOptions, IDatabase, IMain } from 'pg-promise';
import UserRepository from './user-repository';
import PostRepository from './post-repository';

dotenv.config();

interface Extensions {
    users: UserRepository;
    posts: PostRepository;
}

type ExtendedProtocol = IDatabase<Extensions> & Extensions;

const initOptions: IInitOptions<Extensions> = {
    extend(protocolObj: ExtendedProtocol) {
        protocolObj.users = new UserRepository(protocolObj);
        protocolObj.posts = new PostRepository(protocolObj);
    },
    receive(data) {
        camelCaseColumns(data);
    },
};

export const pgp: IMain = pgPromise(initOptions);

function camelCaseColumns(data: { [key: string]: string }[]) {
    const tmp = data[0];
    for (const prop in tmp) {
        const camel = pgp.utils.camelize(prop);
        if (!(camel in tmp)) {
            for (const d of data) {
                d[camel] = d[prop];
                delete d[prop];
            }
        }
    }
}

interface ConnectionConfig {
    host: string;
    port: number;
    database: string;
    user: string;
    password: string;
}

const {
    NODE_ENV,
    DATABASE_URL,
    DB_HOST,
    DB_PORT,
    DB_NAME,
    DB_NAME_TEST,
    POSTGRES_USER,
    POSTGRES_PASSWORD,
} = process.env;

const connectionConfig: ConnectionConfig = {
    host: DB_HOST,
    port: Number(DB_PORT),
    database: NODE_ENV === 'test' ? DB_NAME_TEST : DB_NAME,
    user: POSTGRES_USER,
    password: POSTGRES_PASSWORD,
};

const connection = NODE_ENV === 'production' ? DATABASE_URL : connectionConfig;

export const db: ExtendedProtocol = pgp(connection);
