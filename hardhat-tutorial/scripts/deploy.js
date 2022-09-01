const { ethers } = require("hardhat")

async function main() {
  const metadataURI = "ipfs://Qmbygo38DWF1V8GttM1zy89KzyZTPU2FLUzQtiDvB7q6i5/"
  const LW3PunksContract = await ethers.getContractFactory("LW3Punks")
  const deployedLW3Punks = await LW3PunksContract.deploy(metadataURI)
  await deployedLW3Punks.deployed()
  
  console.log("LW3Punks successfully deployed to", deployedLW3Punks.address)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.log(error)
    process.exit(1)
  })