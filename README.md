# 🚀 Trading Scenario Cypress Testing

Welcome to the Cypress automated test suite example for trading scenarios using RxJS with WebSockets!

## 🧰 Prerequisites

Before you begin, ensure you have the following installed:

- [Node.js and npm](https://nodejs.org/)

## 🛠️ Setup & Installation

1. **📥 Clone the Repository**:

    ```bash
    git clone <repository-url>
    cd <repository-folder>
    ```

2. **📦 Install Dependencies**:

    ```bash
    npm install
    ```

## 🏃 Running Tests

### 🖥️ Debug Mode

To see the tests execute in a browser:

  ```bash
  npm run test:debug
  ```

### 🤖 Headless Mode (for Continuous Integration)
To run tests in headless mode:

  ```bash
  npm run test:headless
  ```

## ⚙️ Technologies

- [**Cypress**](https://www.cypress.io/): For end-to-end testing.
- [**RxJS**](https://rxjs.dev/guide/installation): RxJS is a library for reactive programming, and for WebSocket testing.
- [**cypress-websocket-testing**](https://github.com/lensesio/cypress-websocket-testing): To enable WebSocket testing in Cypress (alternative library).
- [**crypto-js**](https://github.com/brix/crypto-js): For cryptographic operations.