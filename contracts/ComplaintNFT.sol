// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract ComplaintNFT is ERC721, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    struct Complaint {
        string name;
        string phone;
        string location;
        string description;
        uint8 status; // 0: Open, 1: In Progress, 2: Resolved
        uint256 timestamp;
    }

    mapping(uint256 => Complaint) public complaints;

    constructor() ERC721("ComplaintNFT", "CNFT") {}

    function createComplaint(
        string memory name,
        string memory phone,
        string memory location,
        string memory description
    ) public returns (uint256) {
        _tokenIds.increment();
        uint256 newItemId = _tokenIds.current();
        _mint(msg.sender, newItemId);

        complaints[newItemId - 1] = Complaint({
            name: name,
            phone: phone,
            location: location,
            description: description,
            status: 0, // Start as Open
            timestamp: block.timestamp
        });

        return newItemId;
    }

    function totalSupply() public view returns (uint256) {
        return _tokenIds.current();
    }
}