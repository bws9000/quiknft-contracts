const { accounts, contract, web3 } = require('@openzeppelin/test-environment');
const { BN, expectRevert } = require('@openzeppelin/test-helpers');
const expectEvent = require('@openzeppelin/test-helpers/src/expectEvent');
const { expect } = require('chai');

const QuikTwo = contract.fromArtifact('QuikTwo');

/**
 * owner deployed contract
 * addr1 minted an nft token
 */
describe('QuikTwo', function () {

  const [owner, addr1, addr2] = accounts;

  beforeEach('init', async function(){
    this.newToken = await QuikTwo.new(
        'MyQUIKTWO',
        'QUIKTWO',
        'https://baseuri',
        { from: owner }
    );
  });

  describe('check token data', function () {
    it('the symbol should be QUIKTWO', async function () {
      expect(await this.newToken.symbol()).equal('QUIKTWO');
    });
  });

  //public mint set false by default
  describe('mint an NFT', function () {
    describe('when public mint is set to false', function (){
      it('will revert', async function () {
        await expectRevert(
          this.newToken.mintOneNft(),
          'Error: Public minting is not available',
          { from: addr1 },)
      })
    });
  });

  describe('update public mint to true', function(){

      beforeEach(async function() {
        this.receipt = await this.newToken.setPublicMintStatus(true,{from:owner});
        this.firstTokenMinted = 0;
      });

      describe('minting when public minting enabled', function (){
        
        it('will update the value of public mint to true', async function(){
          expect(await this.newToken.getPublicMintStatus()).equal(true);
        });

      });

      it('should emit event UpdatedMintStatus', async function(){
        expectEvent(
          this.receipt,'UpdatedMintStatus',{
            oldValue: false,
            newValue: true
          }
        );
      });

      describe('public minting enabled mint', function(){
        it('i should have two nfts minted', async function () {
          await this.newToken.mintOneNft({ from: addr1 });
          await this.newToken.mintOneNft({ from: addr1 });
          const count = await this.newToken.balanceOf(addr1);
          expect(Number(count)).to.equal(2);
        });
      });

      describe('testing total supply', function(){
        it('should return 2 for totalSupply', async function(){
          await this.newToken.mintOneNft({ from: addr1 });
          await this.newToken.mintOneNft({ from: addr1 });
          const totalSupply = await this.newToken.totalSupply();
          expect(Number(totalSupply)).to.equal(2);
        })
      });


      describe('set approval to start token transfer after sale', function(){
        it('should approve transfer to addr2', async function(){
          
          await this.newToken.mintOneNft({ from: addr1 }); // mint 1 token
          
          this.receipt = await this.newToken.approve(
            addr2, 
            this.firstTokenMinted, 
            {from: addr1});
          expectEvent(
            this.receipt,'Approval',{
              owner: addr1,
              approved: addr2,
              tokenId: new BN(this.firstTokenMinted)
            }
          );
          
        });
      });

      describe('transfer token to new owner after approval', function(){
        it('should transfer token 0 to new owner', async function(){
          
          await this.newToken.mintOneNft({ from: addr1 }); // mint 1 token
          
          this.receipt = await this.newToken.safeTransferFrom(
            addr1,
            addr2,
            this.firstTokenMinted,
            {from:addr1});
          expectEvent(
            this.receipt,'Transfer',{
              from: addr1,
              to: addr2,
              tokenId: new BN(this.firstTokenMinted)
            }
          ); 
          
        });
      });

      describe('list token for sale', function(){
        it('should set token price', async function(){
          
          await this.newToken.mintOneNft({ from: addr1 });
          
          await this.newToken.setTokenPrice(this.firstTokenMinted, 
            web3.utils.toWei('1.3'), {from:addr1});
          
            expect(await this.newToken.getTokenPrice(this.firstTokenMinted))
          .to.be.bignumber.equal(web3.utils.toWei('1.3'));
        });

      });

  });

});


// {
//   "tx": "0x8a1d9e0fd79d2abe44f68c2a5f1880b1916145045051bbdba52511752f4aeb2a",
//   "receipt": {
//     "transactionHash": "0x8a1d9e0fd79d2abe44f68c2a5f1880b1916145045051bbdba52511752f4aeb2a",
//     "transactionIndex": 0,
//     "blockHash": "0xbc2a4998455d7625061bd75520c73d47846f2af9932758f7379f4d9800e80eef",
//     "blockNumber": 41,
//     "from": "0x9fdebd195748d8da6dce81fd09a93ae7d80aff3c",
//     "to": "0xfe8e3dee1bafa90f64c7f347e2207a9f607e1358",
//     "gasUsed": 46953,
//     "cumulativeGasUsed": 46953,
//     "contractAddress": null,
//     "logs": [
//       {
//         "logIndex": 0,
//         "transactionIndex": 0,
//         "transactionHash": "0x8a1d9e0fd79d2abe44f68c2a5f1880b1916145045051bbdba52511752f4aeb2a",
//         "blockHash": "0xbc2a4998455d7625061bd75520c73d47846f2af9932758f7379f4d9800e80eef",
//         "blockNumber": 41,
//         "address": "0xFe8e3DEE1baFA90f64c7F347e2207A9F607E1358",
//         "type": "mined",
//         "removed": false,
//         "id": "log_6db8a7af",
//         "event": "Approval",
//         "args": {
//           "0": "0x9FDEBd195748d8Da6DcE81Fd09A93aE7d80AFF3c",
//           "1": "0x0000000000000000000000000000000000000000",
//           "2": "0",
//           "__length__": 3,
//           "owner": "0x9FDEBd195748d8Da6DcE81Fd09A93aE7d80AFF3c",
//           "approved": "0x0000000000000000000000000000000000000000",
//           "tokenId": "0"
//         }
//       },
//       {
//         "logIndex": 1,
//         "transactionIndex": 0,
//         "transactionHash": "0x8a1d9e0fd79d2abe44f68c2a5f1880b1916145045051bbdba52511752f4aeb2a",
//         "blockHash": "0xbc2a4998455d7625061bd75520c73d47846f2af9932758f7379f4d9800e80eef",
//         "blockNumber": 41,
//         "address": "0xFe8e3DEE1baFA90f64c7F347e2207A9F607E1358",
//         "type": "mined",
//         "removed": false,
//         "id": "log_70928f95",
//         "event": "Transfer",
//         "args": {
//           "0": "0x9FDEBd195748d8Da6DcE81Fd09A93aE7d80AFF3c",
//           "1": "0x62fF9BD6D181D96D630B4fF3AA8293802Fe33B5F",
//           "2": "0",
//           "__length__": 3,
//           "from": "0x9FDEBd195748d8Da6DcE81Fd09A93aE7d80AFF3c",
//           "to": "0x62fF9BD6D181D96D630B4fF3AA8293802Fe33B5F",
//           "tokenId": "0"
//         }
//       }
//     ],
//     "status": true,
//     "logsBloom": "0x00000000000000008000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000200000000000000000000000000008000000000000000000000000000000000000000000000000420000000004000000000800000000000000000000000010000001000000000000000000000000000000000000000000000000002000000000000000020000000000000000000001000000000000000000000000000000000000000000000002000000000000000000000000000000000000001000000000000020000010000000000000000000010000000000000000000000000400000000000000",
//     "rawLogs": [
//       {
//         "logIndex": 0,
//         "transactionIndex": 0,
//         "transactionHash": "0x8a1d9e0fd79d2abe44f68c2a5f1880b1916145045051bbdba52511752f4aeb2a",
//         "blockHash": "0xbc2a4998455d7625061bd75520c73d47846f2af9932758f7379f4d9800e80eef",
//         "blockNumber": 41,
//         "address": "0xFe8e3DEE1baFA90f64c7F347e2207A9F607E1358",
//         "data": "0x",
//         "topics": [
//           "0x8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925",
//           "0x0000000000000000000000009fdebd195748d8da6dce81fd09a93ae7d80aff3c",
//           "0x0000000000000000000000000000000000000000000000000000000000000000",
//           "0x0000000000000000000000000000000000000000000000000000000000000000"
//         ],
//         "type": "mined",
//         "removed": false,
//         "id": "log_6db8a7af"
//       },
//       {
//         "logIndex": 1,
//         "transactionIndex": 0,
//         "transactionHash": "0x8a1d9e0fd79d2abe44f68c2a5f1880b1916145045051bbdba52511752f4aeb2a",
//         "blockHash": "0xbc2a4998455d7625061bd75520c73d47846f2af9932758f7379f4d9800e80eef",
//         "blockNumber": 41,
//         "address": "0xFe8e3DEE1baFA90f64c7F347e2207A9F607E1358",
//         "data": "0x",
//         "topics": [
//           "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef",
//           "0x0000000000000000000000009fdebd195748d8da6dce81fd09a93ae7d80aff3c",
//           "0x00000000000000000000000062ff9bd6d181d96d630b4ff3aa8293802fe33b5f",
//           "0x0000000000000000000000000000000000000000000000000000000000000000"
//         ],
//         "type": "mined",
//         "removed": false,
//         "id": "log_70928f95"
//       }
//     ]
//   },
//   "logs": [
//     {
//       "logIndex": 0,
//       "transactionIndex": 0,
//       "transactionHash": "0x8a1d9e0fd79d2abe44f68c2a5f1880b1916145045051bbdba52511752f4aeb2a",
//       "blockHash": "0xbc2a4998455d7625061bd75520c73d47846f2af9932758f7379f4d9800e80eef",
//       "blockNumber": 41,
//       "address": "0xFe8e3DEE1baFA90f64c7F347e2207A9F607E1358",
//       "type": "mined",
//       "removed": false,
//       "id": "log_6db8a7af",
//       "event": "Approval",
//       "args": {
//         "0": "0x9FDEBd195748d8Da6DcE81Fd09A93aE7d80AFF3c",
//         "1": "0x0000000000000000000000000000000000000000",
//         "2": "0",
//         "__length__": 3,
//         "owner": "0x9FDEBd195748d8Da6DcE81Fd09A93aE7d80AFF3c",
//         "approved": "0x0000000000000000000000000000000000000000",
//         "tokenId": "0"
//       }
//     },
//     {
//       "logIndex": 1,
//       "transactionIndex": 0,
//       "transactionHash": "0x8a1d9e0fd79d2abe44f68c2a5f1880b1916145045051bbdba52511752f4aeb2a",
//       "blockHash": "0xbc2a4998455d7625061bd75520c73d47846f2af9932758f7379f4d9800e80eef",
//       "blockNumber": 41,
//       "address": "0xFe8e3DEE1baFA90f64c7F347e2207A9F607E1358",
//       "type": "mined",
//       "removed": false,
//       "id": "log_70928f95",
//       "event": "Transfer",
//       "args": {
//         "0": "0x9FDEBd195748d8Da6DcE81Fd09A93aE7d80AFF3c",
//         "1": "0x62fF9BD6D181D96D630B4fF3AA8293802Fe33B5F",
//         "2": "0",
//         "__length__": 3,
//         "from": "0x9FDEBd195748d8Da6DcE81Fd09A93aE7d80AFF3c",
//         "to": "0x62fF9BD6D181D96D630B4fF3AA8293802Fe33B5F",
//         "tokenId": "0"
//       }
//     }
//   ]
// }