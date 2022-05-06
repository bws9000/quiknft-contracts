const { accounts, contract } = require('@openzeppelin/test-environment');
const { expect } = require('chai');

describe('NftFactory', function () {

  const [owner, addr1] = accounts;

  const NftFactory = contract.fromArtifact('NftFactory');
  const NftFactoryItemERC721 = contract.fromArtifact('NftFactoryItemERC721');

  beforeEach('Deploy NftFactory and NftFactoryItemERC721', async function () {
    this.nftFactory = await NftFactory.new({ from: owner });
    this.nftItem = await NftFactoryItemERC721.new({ from: owner });
  });

  describe('NftFactory Owner', function () {
    
    it('NftFactory contract owner is sender', async function () {
      expect(await this.nftFactory.owner()).to.equal(owner);
    });

  });

  describe('Spawn Nft with NftFactory', function () {

      it('Spawn New Nft', async function(){
        const receipt = await this.nftFactory.spawn(
          this.nftItem.address, 
          'MyNFT', 
          'MNFT', 
          'https://baseURI',
          [],
          { from: addr1 });

          expect(receipt.logs.filter(res => res.event === 'NftSpawned')[0]
          .args.newNft).to.have.lengthOf(42);
      });

  });

});
