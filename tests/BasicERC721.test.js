const { accounts, contract } = require('@openzeppelin/test-environment');
const { expectRevert } = require('@openzeppelin/test-helpers');
const expectEvent = require('@openzeppelin/test-helpers/src/expectEvent');
const { expect } = require('chai');

const BasicERC721 = contract.fromArtifact('BasicERC721');

/**
 * owner deployed contract
 * addr1 minted an nft token
 */
describe('BasicERC721', function () {

  const [owner, addr1] = accounts;

  beforeEach('init', async function(){
    this.newToken = await BasicERC721.new(
        'MyNftContract',
        'MNFT',
        'https://baseuri',
        { from: owner }
    );
  });

  describe('symbol should be MNFT', function () {
    it('the symbol should be MNFT', async function () {
      expect(await this.newToken.symbol()).equal('MNFT');
    });
  });

  //public mint set false by default
  describe('mint an NFT', function () {
    describe('when public mint is set to false', function (){
      it('will revert', async function () {
        await expectRevert(
          this.newToken.mintOneNft(),
          'Public minting is not available at this time',
          { from: addr1 },) // <-- addr1 not owner of deployed contract
      })
    });
  });

  describe('update public mint to true', function(){

    beforeEach(async function() {
      this.receipt = await this.newToken.setPublicMintStatus(true,{from:owner});
    });

    it('will update the value of public mint', async function(){
      expect(await this.newToken.publicMintStatus()).equal(true);
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

        const count = await this.newToken._tokenIds(); 
        // _tokenIds are currently public in our NFT
        // we're accessing the value of the Counter struct directly for this example
        // https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/utils/Counters.sol
        // not recommended, just for testing purposes to prove a point...
        expect(Number(count)).to.equal(2);
    });
  });


  });

});