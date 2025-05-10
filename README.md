# ComplaintNFT Smart Contract

## Overview

The `ComplaintNFT` contract is an Ethereum-based smart contract that leverages the ERC721 standard to create Non-Fungible Tokens (NFTs) representing civic complaints. Each complaint is stored as a unique NFT, ensuring transparency and immutability of the reports.

## Features

- **ERC721 Compliance**: Implements the ERC721 standard for NFTs.
- **Complaint Struct**: Stores complaint details including name, phone, location, description, status, and timestamp.
- **Complaint Status**: Tracks the status of complaints (Open, In Progress, Resolved).
- **Minting**: Allows users to create a new complaint, which mints a new NFT.
- **Ownership**: Uses OpenZeppelin's `Ownable` for contract ownership management.

## Contract Details

- **Name**: ComplaintNFT
- **Symbol**: CNFT

## Functions

### `createComplaint`

```solidity
function createComplaint(
    string memory name,
    string memory phone,
    string memory location,
    string memory description
) public returns (uint256)
```
