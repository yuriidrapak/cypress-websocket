import { take, toArray } from 'rxjs/operators';
import sha256 from "crypto-js/hmac-sha256";
import usersData from '../fixtures/test-data/users.json';
import Wss from '../support/api/wss-rxjs';
import Helpers from '../support/helpers';

describe('RxJS WebSocket - Exchange GW (Trading) part', () => {

  before(() => {
    cy.wrapObservable(Wss.connect('wss://sandbox-shared.staging.exberry-uat.io')).should(() => {
      expect(Wss.ws.readyState).to.eq(WebSocket.OPEN);
    });
    Wss.listen();
  });

  after(() => {
    Wss.close();
  });

  it('Create session', () => {
    cy.log('Creating session...');
    const csApiKey = usersData.apiKeyUser1;
    const csSecret = usersData.secretKeyUser1;
    const csTimestamp = Date.now().toString();
    const csSignature = sha256(`"apiKey":"${csApiKey}","timestamp":"${String(Date.now())}"`, csSecret).toString();

    const sessionMessage = {
      "d": {
        "apiKey": csApiKey,
        "timestamp": csTimestamp,
        "signature": csSignature
      },
      "q": "exchange.market/createSession",
      "sid": 1
    };

    Wss.sendMessage(sessionMessage);

    cy.wrapObservable(Wss.wsObservable.pipe(take(2), toArray())).should((messages) => {
      // Verifying the 1 message:
      console.log("createSession - Received 1 message:", messages[0]);
      expect(messages[0]).to.not.be.undefined;
      expect(messages[0]).to.have.property('q', "exchange.market/createSession");
      expect(messages[0]).to.have.property('sid', 1);

      // Verifying the 2 message:
      console.log("createSession - Received 2 message:", messages[0]);
      expect(messages[1]).to.have.property('sig', 1);
    });
  });

  it('Place order', () => {
    cy.log('Placing order...');
    const csTimestamp = Date.now().toString();

    const placeOrderMessage = {
      "d": {
        "orderType": "Limit",
        "instrument": "INS1",
        "side": "Buy",
        "quantity": 1.25,
        "price": 100.5,
        "timeInForce": "GTC",
        "mpOrderId": csTimestamp,
        "userId": "UATUserTest1"
      },
      "q": "v1/exchange.market/placeOrder",
      "sid": 1
    };

    Wss.sendMessage(placeOrderMessage);

    cy.wrapObservable(Wss.wsObservable.pipe(take(2), toArray())).should((messages) => {
      // Verifying the 1 message:
      console.log("placeOrder - Received 1 message:", messages[0]);
      expect(messages[0]).to.not.be.undefined;
      expect(messages[0]).to.have.property('q', "v1/exchange.market/placeOrder");
      expect(messages[0]).to.have.property('sid', 1);
      expect(messages[0]).to.have.property('d');
      expect(messages[0].d).to.have.property('orderId');
      expect(messages[0].d.orderId).to.be.a('number');
      expect(messages[0].d).to.have.property('orderStatus', 'Pending');

      // Verifying the 2 message:
      console.log("placeOrder - Received 2 message:", messages[1]);
      expect(messages[1]).to.not.be.undefined;
      expect(messages[1]).to.have.property('sig', 1);
      expect(messages[1]).to.have.property('q', "v1/exchange.market/placeOrder");
      expect(messages[1]).to.have.property('sid', 1);
    });
  });

  it('Execution reports', () => {
    cy.log('Execution reports...');

    let trackingNumber;
    const executionReportsMessage = {
      "d": {
        "trackingNumber": 0
      },
      "q": "v1/exchange.market/executionReports",
      "sid": 1
    };

    Wss.sendMessage(executionReportsMessage);

    cy.wrapObservable(Wss.wsObservable.pipe(take(1), toArray())).should((messages) => {
      console.log("executionReports - Received 1 message:", messages[0]);
      expect(messages[0]).to.have.property('q', 'v1/exchange.market/executionReports');
      expect(messages[0]).to.have.property('sid').and.be.a('number');
      expect(messages[0]).to.have.property('d');
      expect(messages[0].d).to.have.property('messageType', 'Add');
      expect(messages[0].d).to.have.property('orderId').and.be.a('number');
      expect(messages[0].d).to.have.property('mpOrderId').and.be.a('number');
      expect(messages[0].d).to.have.property('orderType', 'Limit');
      expect(messages[0].d).to.have.property('side', 'Buy');
      expect(messages[0].d).to.have.property('instrument', 'Ins1');
      expect(messages[0].d).to.have.property('quantity', 1.25);
      expect(messages[0].d).to.have.property('price', 100.5);
      expect(messages[0].d).to.have.property('timeInForce', 'GTC');
      expect(messages[0].d).to.have.property('orderTimestamp').and.be.a('number');
      expect(messages[0].d).to.have.property('filledQuantity', 0);
      expect(messages[0].d).to.have.property('remainingOpenQuantity', 1.25);
      expect(messages[0].d).to.have.property('removedQuantity', 0);
      expect(messages[0].d).to.have.property('marketModel', 'T');
      expect(messages[0].d).to.have.property('userId', 'UATUserTest1');
      expect(messages[0].d).to.have.property('eventTimestamp').and.be.a('number');
      expect(messages[0].d).to.have.property('eventId').and.be.a('number');
      expect(messages[0].d).to.have.property('trackingNumber').and.be.a('number');
      expect(messages[0].d).to.have.property('mpId').and.be.a('number');
      expect(messages[0].d).to.have.property('mpName').and.be.a('string');

      trackingNumber = messages[0].d.trackingNumber;

    });

    // Read the users.json file
    cy.readFile('cypress/fixtures/test-data/users.json').then((data) => {
      // Update the trackingNumber value
      data.trackingNumber1 = trackingNumber;
      // Write the updated data back to users.json
      cy.writeFile('cypress/fixtures/test-data/users.json', data, 'utf8');
    });
  });

  it('Trades', () => {
    cy.log('Trades...');
    const tradesTrackingNumber = usersData.trackingNumber1;
    const tradesSid = Helpers.generateRandomSid(8);
    const tradesMessage = {
      "d": {
        "trackingNumber": tradesTrackingNumber
      },
      "q": "v1/exchange.market/trades",
      "sid": 1
    };

    Wss.sendMessage(tradesMessage);

    cy.wrapObservable(Wss.wsObservable.pipe(take(1), toArray())).should((messages) => {
      console.log("trades - Received 1 message:", messages[0]);

      expect(messages[0]).to.have.property('sig').and.be.a('number');
      expect(messages[0]).to.have.property('q', 'v1/exchange.market/trades');
      expect(messages[0]).to.have.property('sid', 1);
      expect(messages[0]).to.have.property('d');
    });
  });
});