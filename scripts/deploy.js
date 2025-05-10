async function main() {
  const ComplaintNFT = await ethers.getContractFactory("ComplaintNFT");
  const complaintNFT = await ComplaintNFT.deploy();
  await complaintNFT.waitForDeployment(); // Changed from deployed() to waitForDeployment()

  console.log("ComplaintNFT deployed to:", await complaintNFT.getAddress()); // Changed to getAddress()
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });