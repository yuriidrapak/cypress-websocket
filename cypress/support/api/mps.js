/**
 * MPs endpoint
 */

export default class Mps {

    static createMpsAndSaveId({ mpName, mpCompId }) {

        // Read the jwtToken from users.json
        cy.readFile('cypress/fixtures/test-data/users.json').then((data) => {
            const jwtTokenUser1 = data.jwtTokenUser1;

            cy.request({
                method: 'POST',
                url: 'https://admin-api-shared.staging.exberry-uat.io/api/mps',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${jwtTokenUser1}`
                },
                body: {
                    name: mpName,
                    compId: mpCompId
                }
            }).then((response) => {
                cy.log(response.body);
                expect(response.body.id).to.exist;
                expect(response.body.name).to.equal(mpName);
                expect(response.body.compId).to.equal(mpCompId);

                let mpsID = response.body.id;

                // Read the users.json file
                cy.readFile('cypress/fixtures/test-data/users.json').then((data) => {
                    // Update the mpsID value
                    data.mpsIdUser1 = mpsID;

                    // Write the updated data back to users.json
                    cy.writeFile('cypress/fixtures/test-data/users.json', data, 'utf8');
                });
            });
        });
    };

    static createApiKey(apiKeyLabel) {
        // Read the mpsIdUser1 from users.json
        cy.readFile('cypress/fixtures/test-data/users.json').then((data) => {
            const mpsId = data.mpsIdUser1;
            const jwtTokenUser1 = data.jwtTokenUser1;

            cy.request({
                method: 'POST',
                url: `https://admin-api-shared.staging.exberry-uat.io/api/mps/${mpsId}/api-keys`,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${jwtTokenUser1}`
                },
                body: {
                    "label": apiKeyLabel,
                    "permissions": [
                        "market-service:market:order_book_depth",
                        "market-service:market:order_book_state",
                        "market-service:market:place_order",
                        "market-service:market:cancel_order",
                        "market-service:market:modify_order",
                        "market-service:market:replace_order",
                        "market-service:market:mass_cancel",
                        "market-service:market:execution_reports",
                        "market-service:market:mass_order_status",
                        "market-service:market:trades",
                        "reporting:mp:orders",
                        "reporting:mp:trades"
                    ],
                    "cancelOnDisconnect": false
                }
            }).then((response) => {
                cy.log(response.body);
                expect(response.body.label).to.equal(apiKeyLabel);
                expect(response.body.permissions).to.have.length(12);
                expect(response.body.cancelOnDisconnect).to.equal(false);
                expect(response.body.mpId).to.equal(mpsId);
                expect(response.body.secret).to.exist;
                expect(response.body.apiKey).to.exist;

                let secretKey = response.body.secret;
                let apiKey = response.body.apiKey;

                
                // Read the users.json file
                cy.readFile('cypress/fixtures/test-data/users.json').then((data) => {
                    // Update the secretKey, apiKey values
                    data.secretKeyUser1 = secretKey;
                    data.apiKeyUser1 = apiKey;

                    // Write the updated data back to users.json
                    cy.writeFile('cypress/fixtures/test-data/users.json', data, 'utf8');
                });
            });
        });
    };
};