import { test, expect } from '@fixtures/pages.fixtures';
import { createRandomUser } from '@test-data/generators/userDataFactory';

test.describe("Registration Page", () => {
    test("register a new customer with valid data", { tag: ['@smoke', '@regression'] }, async ({registrationPage}) => {
        const user = createRandomUser();

        await registrationPage.open();
        await registrationPage.register(user);

        await expect(registrationPage.welcomeHeading).toContainText(user.username);

    },)

})