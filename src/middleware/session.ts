import dotenv from 'dotenv';
import redis, { RedisClient } from 'redis';
import createRedisStore from 'connect-redis';
import session from 'express-session';
import uuid from 'uuid';

dotenv.config();

const { NODE_ENV, REDIS_HOST, REDIS_PORT, REDIS_URL, SESSION_SECRET } = process.env;

let redisClient: RedisClient;

if (NODE_ENV === 'production') {
    redisClient = redis.createClient(REDIS_URL);
} else {
    redisClient = redis.createClient({ host: REDIS_HOST, port: REDIS_PORT });
}

redisClient.on('error', err => {
    console.log('Redis error: ', err);
});

const RedisStore = createRedisStore(session);

const cookieOptions = {
    secure: NODE_ENV === 'production' ? true : false,
    maxAge: NODE_ENV === 'production' ? 30 * 24 * 60 * 60000 : 5 * 60000,
};

export default function createSessionMiddleware() {
    return session({
        genid: () => uuid(),
        store: new RedisStore({ client: redisClient }),
        name: 'sid',
        secret: SESSION_SECRET,
        resave: false,
        cookie: cookieOptions,
        saveUninitialized: true,
    });
}
