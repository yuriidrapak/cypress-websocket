import Auth from '../support/api/auth';
import Calendar from '../support/api/calendars';
import Helpers from '../support/helpers';
import Instruments from '../support/api/instruments';
import Mps from '../support/api/mps';
import usersData from '../fixtures/test-data/users.json';

describe('Admin part', () => {
  it('Get JWT Token', () => {
    Auth.fetchAuthToken(usersData.emailUser1, usersData.passwordUser1);
  });

  it('Create Calendar', () => {
    Calendar.createCalendarAndSaveId({
      calendarName: 'New' + Helpers.generateRandomSymbols(8),
      calendarTimeZone: '+02:00',
      calendarMarketOpen: '09:00',
      calendarMarketClose: '18:00'
    });
  });

  it('Create Instrument', () => {
    Instruments.createInstrumentAndSaveId({
      symbol: 'Test' + Helpers.generateRandomSymbols(8),
      quoteCurrency: 'USD',
      activityStatus: 'ACTIVE',
      description: 'Testing description'
    });
  });

  it('Create MP', () => {
    Mps.createMpsAndSaveId({
      mpName: 'MP Test' + Helpers.generateRandomSymbols(8),
      mpCompId: 'compId' + Helpers.generateRandomSymbols(8)
    });
  });

  it('Create APIKey for MP', () => {
    Mps.createApiKey(
      "Label" + Helpers.generateRandomSymbols(8)
    );
  });

});