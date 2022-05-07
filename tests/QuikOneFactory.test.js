const { accounts, contract } = require('@openzeppelin/test-environment');
const { expect } = require('chai');

describe('QuikOneFactory', function () {

  const [owner, addr1] = accounts;

  const NftFactory = contract.fromArtifact('NftFactory');
  const QuikOneItem = contract.fromArtifact('QuikOneItem');

  beforeEach('Deploy QuikOneFactory and NftFactoryItem', async function () {
    this.nftFactory = await NftFactory.new({ from: owner });
    this.nftItem = await QuikOneItem.new({ from: owner });
  });

  describe('NftFactory Owner', function () {
    it('NftFactory contract owner is deployer', async function () {
      expect(await this.nftFactory.owner()).to.equal(owner);
    });

  });

  describe('Spawn new NFT contract with NftFactory', function () {

      it('Spawn New Nft Token', async function(){
        const receipt = await this.nftFactory.spawn(
          this.nftItem.address, 
          'QUIK', 
          'QUIKONE', 
          'https://baseURI',
          [],
          { from: addr1 });

          expect(receipt.logs.filter(res => res.event === 'NftSpawned')[0]
          .args.newNft).to.have.lengthOf(42);
      });

  });

});
