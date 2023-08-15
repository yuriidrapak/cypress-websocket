/**
 * Calendar endpoint
 */

export default class Calendar {

    static createCalendarAndSaveId({ calendarName, calendarTimeZone, calendarMarketOpen, calendarMarketClose }) {
        let calendarTradingDays = [
            "MONDAY",
            "TUESDAY",
            "WEDNESDAY",
            "THURSDAY",
            "FRIDAY",
            "SATURDAY",
            "SUNDAY"
        ];

        let calendarHolidays = [
            {
                "date": "2023-01-01",
                "closeTime": "13:00",
                "name": "New Yaer"
            }
        ];

        cy.log(calendarName)

        // Read the jwtToken from users.json
        cy.readFile('cypress/fixtures/test-data/users.json').then((data) => {
            const jwtTokenUser1 = data.jwtTokenUser1;

            cy.request({
                method: 'POST',
                url: 'https://admin-api-shared.staging.exberry-uat.io/api/v2/calendars',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${jwtTokenUser1}`
                },
                body: {
                    tradingDays: calendarTradingDays,
                    name: calendarName,
                    timeZone: calendarTimeZone,
                    marketOpen: calendarMarketOpen,
                    marketClose: calendarMarketClose,
                    holidays: calendarHolidays
                }
            }).then((response) => {
                cy.log(response.body);
                let calendarId = response.body.id;

                expect(response.body.id).to.exist;
                expect(response.body.tradingDays).to.deep.equal(calendarTradingDays);
                expect(response.body.name).to.equal(calendarName);
                expect(response.body.timeZone).to.equal(calendarTimeZone);
                expect(response.body.marketOpen).to.equal(calendarMarketOpen);
                expect(response.body.marketClose).to.equal(calendarMarketClose);
                expect(response.body.holidays).to.deep.equal(calendarHolidays);

                // Read the users.json file
                cy.readFile('cypress/fixtures/test-data/users.json').then((data) => {
                    // Update the calendarId value
                    data.calendarIdUser1 = calendarId;

                    // Write the updated data back to users.json
                    cy.writeFile('cypress/fixtures/test-data/users.json', data, 'utf8');
                });
            });
        });
    };

};
