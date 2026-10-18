import { faker } from '@faker-js/faker';
import type { User } from '@app-types/index';

// Names like "O'Connor" can trip up older apps like ParaBank, so keep letters only.
const lettersOnly = (value: string): string => value.replace(/[^a-zA-Z]/g, '');

export function createRandomUser(overrides: Partial<User> = {}): User {
  const firstName = lettersOnly(faker.person.firstName());
  const lastName = lettersOnly(faker.person.lastName());

  return {
    firstName,
    lastName,
    address: faker.location.streetAddress(),
    city: faker.location.city(),
    state: faker.location.state({ abbreviated: true }),
    zipCode: faker.location.zipCode('#####'),
    phoneNumber: faker.string.numeric(10),
    ssn: faker.string.numeric(9),
    username: `${firstName.toLowerCase()}_${faker.string.alphanumeric({ length: 8, casing: 'lower' })}`,
    password: 'Passw0rd!123',
    ...overrides,
  };
}