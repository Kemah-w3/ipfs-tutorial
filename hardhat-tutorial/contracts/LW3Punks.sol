//SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import  "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract LW3Punks is ERC721Enumerable, Ownable {
    using Strings for uint256;

    //stores the baseURI of the tokenURI(tokenURI = baseURI + tokenID)
    string _baseTokenURI;

    //stores mint price of the NFT
    uint256 public _price = 0.005 ether;

    //stores emergency state to pause mint
    bool _paused = false;

    //stores maximum supply of the NFT 
    uint256 public maxTokenIds = 10;

    //stores total number of tokens minted
    uint256 public tokenIds;

    //checks to ensure that the function to which it is attached can be called
    //only when the contract is not paused
    modifier onlyWhenNotPaused() {
        require(!_paused, "Contract is paused!");
        _;
    }

    //initialises the name and symbol of the token 
    //sets the value of _basetokenURI when the contract is first deployed
    constructor(string memory baseURI) ERC721("LW3Punks", "LW3P") {
        _baseTokenURI = baseURI;
    }

    //mint function that allows the user to mint 1 LW3P token
    function _mint() public payable {
        require(msg.value >= _price, "Incorrect Price!");
        require(tokenIds < maxTokenIds, "Sold Out!");
        tokenIds += 1;
        _safeMint(msg.sender, tokenIds);
    }

    //function that overrides the ERC721 baseURI function to return baseTokenURI

    function _baseURI() internal view virtual override returns(string memory) {
        return _baseTokenURI;
    }

    //tokenURI overrides ERC721 tokenURI function
    //returns the tokenURI where we can extract the metadata for a given tokenId

    function tokenURI(uint256 tokenId) public view virtual override returns(string memory) {
        //the _exist() function is an ERC721 function that checks the existence of a token Id
        require(_exists(tokenId), "ERC721 Metadata: URI query for non-existent token Id");

        string memory baseURI = _baseTokenURI;

        //concatenates the baseURI, tokenId and .json extension
        //stores the string in a variable (_tokenURI)
        string memory _tokenURI = string(abi.encodePacked(baseURI, tokenId.toString(), ".json"));

        //returns _tokenURI if length of baseURI is greater than 0
        return bytes(baseURI).length > 0 ? _tokenURI : "";
    }

    //onlyOwner here is a modifier inherited from Ownable contract
    function setPaused(bool val) public onlyOwner {
        _paused = val;
    }

    //withdraw allows the owner to withdraw the balance of the smart contract
    function withdraw() public onlyOwner {
        //owner is a function inherited from ownable that specifies the owner of the contract
        address _owner = owner();
        uint256 amount = address(this).balance;

        //transfers the amount to the _owner 
        //sent check if the transaction was successful
        (bool sent, ) = _owner.call{value: amount}("");
        require(sent, "Failed to send ether!");
    }

    //function receives ether when msg.data is empty
    receive() external payable {}

    //called when msg.data is not empty
    fallback() external payable {}

}