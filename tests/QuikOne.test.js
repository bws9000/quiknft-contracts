const { accounts, contract } = require('@openzeppelin/test-environment');
const { expectRevert } = require('@openzeppelin/test-helpers');
const { expect } = require('chai');

const QuikOne = contract.fromArtifact('QuikOne');

/**
 * owner deployed contract
 * addr1 minted an nft token
 */
describe('QuikOne', function () {

  const [owner, addr1] = accounts;

  beforeEach('init', async function(){
    this.newToken = await QuikOne.new(
        'MyNftContract',
        'QUIKONE',
        'https://baseuri',
        { from: owner }
    );
  });

  describe('check token data', function () {
    it('the symbol should be MNFT', async function () {
      expect(await this.newToken.symbol()).equal('QUIKONE');
    });
  });

  //public mint set false by default
  describe('mint an NFT', function () {
    describe('when public mint is set to false', function (){
      it('will revert', async function () {
        await expectRevert(
          this.newToken.mintOneNft(),
          'Error: No public minting available for QuikOne',
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

        it('will revert when not owner', async function () {
            await expectRevert(
            this.newToken.mintOneNft(),
            'Error: No public minting available for QuikOne',
            { from: addr1 },)
        });
        
        it('i should have two nfts minted as owner', async function () {
            await this.newToken.mintOneNftByOwner({ from: owner });
            await this.newToken.mintOneNftByOwner({ from: owner });
            const count = await this.newToken.balanceOf(owner);
            expect(Number(count)).to.equal(2);
        });

        describe('testing other stuff...', function(){
          it('testy', async function(){
            const totalSupply = await this.newToken.currentTokenId();
            console.log('totalSupply: ' + totalSupply);
          })
        });

      });

  });

});