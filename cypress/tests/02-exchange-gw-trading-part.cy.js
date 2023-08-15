import sha256 from "crypto-js/hmac-sha256";
import usersData from '../fixtures/test-data/users.json';

describe('Exchange GW (Trading) part', () => {
  it('Create session', () => {
    cy.log('Creating session...');
    const apiKey = usersData.apiKeyUser1;
    const secret = usersData.secretKeyUser1;
    const timestamp = Date.now().toString();
    const signature = sha256(`"apiKey":"${apiKey}","timestamp":"${String(Date.now())}"`, secret).toString();

    // For full set of config values, check rxjs documentation
    const config = {
      url: 'wss://sandbox-shared.staging.exberry-uat.io'
    };

    // For common cases:
    cy.streamRequest(config, options).then(results => {
      expect(results).to.not.be.undefined;
    })
    // When in need of a bit more flexibility
    cy.stream(config).then(subject => {
      subject
        .pipe(
          takeUntil(timer(1000)),
          reduce((acc, val) => acc.concat([val]), [])
        )
        .subscribe({
          next: (results) => {
            expect(results).to.not.be.undefined;
          },
          error: (err) => { },
          complete: done
        });
    });


    // // Send a message to the WebSocket server using cy.task
    // cy.task('sendWebSocketMessage', {
    //   "d": {
    //     "apiKey": "",
    //     "signature": "",
    //     "timestamp": ""
    //   },
    //   "q": "exchange.market/createSession",
    //   "sid": 1
    // });


  });

  xit('Place order', () => {

  });

  xit('Execution reports', () => {

  });

  xit('Trades', () => {

  });
});