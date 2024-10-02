// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract AIModelMarketplace {
  struct Model {
    uint256 id;
    string name;
    string description;
    uint256 price;
    address payable creator;
    uint8 ratingSum;
    uint8 ratingCount;
  }

mapping(uint256 => Model) public models;
uint256 public modelCount;

mapping(address => mapping(uint256 => bool)) public purchases;

mapping(address => uint256) public pendingWithdrawals;

function listModel(string memory name, string memory description, uint256 price) public {
    require(price > 0, "Price must be greater than zero");
    modelCount++;
    models[modelCount] = Model(
        modelCount,
        name,
        description,
        price,
        payable(msg.sender),
        0,
        0
    );
}

function purchaseModel(uint256 modelId) public payable {
    Model storage model = models[modelId];
    require(msg.value == model.price, "Incorrect value sent");
    require(model.creator != address(0), "Model does not exist");

    purchases[msg.sender][modelId] = true;
    pendingWithdrawals[model.creator] += msg.value;
}

function rateModel(uint256 modelId, uint8 rating) public {
    require(purchases[msg.sender][modelId], "You have not purchased this model");
    require(rating >= 1 && rating <= 5, "Rating must be between 1 and 5");
    Model storage model = models[modelId];
    model.ratingSum += rating;
    model.ratingCount++;
}

function withdrawFunds() public {
    uint256 amount = pendingWithdrawals[msg.sender];
    require(amount > 0, "No funds to withdraw");

    // Reset the pending balance before transferring to prevent re-entrancy attacks
    pendingWithdrawals[msg.sender] = 0;

    payable(msg.sender).transfer(amount);
}

function getModelDetails(uint256 modelId) public view returns (
    uint256 id,
    string memory name,
    string memory description,
    uint256 price,
    address creator,
    uint8 averageRating
) {
    Model storage model = models[modelId];
    require(model.creator != address(0), "Model does not exist");
    uint8 avgRating = model.ratingCount > 0 ? model.ratingSum / model.ratingCount : 0;
    return (
        model.id,
        model.name,
        model.description,
        model.price,
        model.creator,
        avgRating
    );
}
}