/**
 * Auth token endpoint
 */


export default class Auth {

    static fetchAuthToken(userEmail, userPassword) {
        let jwtToken;

        cy.then(() => {
            cy.request({
                method: 'POST',
                url: 'https://admin-api-shared.staging.exberry-uat.io/api/auth/token',
                body: {
                    email: userEmail,
                    password: userPassword
                }
            }).then((response) => {
                jwtToken = response.body.token;
                cy.log(jwtToken);
                expect(response.body.expiresIn).to.be.gt(0);

                // Read the users.json file
                cy.readFile('cypress/fixtures/test-data/users.json').then((data) => {
                    // Update the jwtTokenUser1 value
                    data.jwtTokenUser1 = jwtToken;

                    // Write the updated data back to users.json
                    cy.writeFile('cypress/fixtures/test-data/users.json', data, 'utf8');
                });
            });
        });
    };

};