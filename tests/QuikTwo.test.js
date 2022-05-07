const { accounts, contract } = require('@openzeppelin/test-environment');
const { expectRevert } = require('@openzeppelin/test-helpers');
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

      describe('testing other stuff...', function(){
        it('testy', async function(){
          const totalSupply = await this.newToken.currentTokenId();
          console.log('totalSupply: ' + totalSupply);
        })
      });

  });

});