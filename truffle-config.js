module.exports = {
    networks: {
        development: {
          host: "localhost",
          port: 8545,
          network_id: "*"
        }
      },
  
    compilers: {
      solc: {
        version: "0.8.9",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200
          }
        }
      },
    },
    mocha: {
      timeout: 5000
    }
  };
