const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("ComplaintNFT", function () {
  let complaintNFT;
  let admin, worker, citizen;

  before(async () => {
    [admin, worker, citizen] = await ethers.getSigners();
    const ComplaintNFT = await ethers.getContractFactory("ComplaintNFT");
    complaintNFT = await ComplaintNFT.deploy();
    await complaintNFT.grantRole(await complaintNFT.WORKER_ROLE(), worker.address);
  });

  it("Should mint a complaint NFT", async function () {
    await complaintNFT.mintComplaint(
      citizen.address,
      "Central Park",
      "Broken bench",
      "QmXoypizjW3WknFiJnKLwHCnL72vedxjQkDDP1mXWo6uco"
    );
    expect(await complaintNFT.ownerOf(0)).to.equal(citizen.address);
  });
});