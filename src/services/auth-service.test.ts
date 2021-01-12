import pgPromise from 'pg-promise';
import db from '@db';
import { HttpError } from '@utils/errors';
import { SignupRequest, User, UserEntity } from '@types';
import * as userService from './user-service';
import * as authService from './auth-service';

jest.mock('@db', () => ({
    users: {
        findOne: jest.fn(),
    },
    pgp: pgPromise(),
}));

describe('AuthService', () => {
    const mockSignupRequest: SignupRequest = {
        email: 'user@test.com',
        username: 'username',
        password: 'password',
    };

    const mockUserEntity: UserEntity = {
        id: '00000000-0000-0000-0000-000000000000',
        email: mockSignupRequest.email,
        username: mockSignupRequest.username,
        password: '$2a$10$37xEfpMwqmfSCAfYlaMzS.trfLiJEqpk4gk.OegKglZRQNw3LIUWG',
        createdAt: new Date(),
        modifiedAt: new Date(),
    };

    describe('#signup', () => {
        beforeEach(() => {
            jest.resetAllMocks();
        });

        test('creates a new user', async () => {
            const mockUser: User = userService.makeUser(mockUserEntity);

            jest.spyOn(userService, 'createUser').mockResolvedValue(mockUser);

            expect.assertions(1);

            await expect(authService.signup(mockSignupRequest)).resolves.toEqual({
                user: mockUser,
            });
        });

        test('returns a message if the provided email or username is associated with an existing user', async () => {
            db.users.findOne = jest.fn().mockResolvedValue(mockUserEntity);

            expect.assertions(1);

            await expect(authService.signup(mockSignupRequest)).resolves.toEqual({
                message: authService.USER_EXISTS_MESSAGE,
            });
        });

        test('throws an HttpError if unsuccessful', async () => {
            const MOCK_ERROR_MESSAGE = 'mock error message';

            jest.spyOn(userService, 'createUser').mockRejectedValue(MOCK_ERROR_MESSAGE);

            expect.assertions(1);

            await expect(authService.signup(mockSignupRequest)).rejects.toThrow(
                new HttpError(MOCK_ERROR_MESSAGE),
            );
        });
    });
});
