/**
 * Instruments endpoint
 */

export default class Instruments {

    static createInstrumentAndSaveId({ symbol, quoteCurrency, activityStatus, description }) {
        const instrumentPricePrecision = "6";
        const instrumentQuantityPrecision = "4";
        const instrumentMinQuantity = "0.0001";
        const instrumentMaxQuantity = "10000000";

        // Read the jwtToken from users.json
        cy.readFile('cypress/fixtures/test-data/users.json').then((data) => {
            const jwtTokenUser1 = data.jwtTokenUser1;
            const calendarIdUser1 = data.calendarIdUser1;

            cy.request({
                method: 'POST',
                url: 'https://admin-api-shared.staging.exberry-uat.io/api/v2/instruments',
                headers: {
                    'Authorization': `Bearer ${jwtTokenUser1}`
                },
                body: {
                    symbol: symbol,
                    quoteCurrency: quoteCurrency,
                    calendarId: calendarIdUser1,
                    pricePrecision: instrumentPricePrecision,
                    quantityPrecision: instrumentQuantityPrecision,
                    minQuantity: instrumentMinQuantity,
                    maxQuantity: instrumentMaxQuantity,
                    activityStatus: activityStatus,
                    description: description
                }
            }).then((response) => {
                let instrumentId = response.body.id;

                cy.log(response.body);
                expect(response.body.id).to.exist;
                expect(response.body.symbol).to.equal(symbol);
                expect(response.body.quoteCurrency).to.equal(quoteCurrency);
                expect(response.body.calendarId).to.equal(calendarIdUser1);
                expect(response.body.pricePrecision).to.equal(instrumentPricePrecision);
                expect(response.body.quantityPrecision).to.equal(instrumentQuantityPrecision);
                expect(response.body.minQuantity).to.equal(instrumentMinQuantity);
                expect(response.body.maxQuantity).to.equal(instrumentMaxQuantity);
                expect(response.body.activityStatus).to.equal(activityStatus);
                expect(response.body.description).to.equal(description);

                // Read the users.json file
                cy.readFile('cypress/fixtures/test-data/users.json').then((data) => {
                    // Update the instrumentId value
                    data.instrumentIdUser1 = instrumentId;

                    // Write the updated data back to users.json
                    cy.writeFile('cypress/fixtures/test-data/users.json', data, 'utf8');
                });
            });
        });
    };
}
