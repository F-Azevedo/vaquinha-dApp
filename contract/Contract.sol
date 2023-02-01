//SPDX-License-Identifier: Unlicens
pragma solidity ^0.8.0;

contract Donation {
    uint public _goal;
    uint public _raisedAmount;
    address public _owner;
    address public _factory;

    event GoalReached(address owner, uint goal, uint raisedAmount);

    constructor(uint goal, address owner) {
        _raisedAmount = 0;
        _goal = goal;
        _owner = owner;
        _factory = msg.sender;
    }

    modifier minDonationAmount() {
        require(msg.value > 0, "Donation amount must be greater than zero.");
        _;
    }

    modifier minWithdrawAmount() {
        require(_raisedAmount >= _goal, "The goal was no reached.");
        _;
    }

    modifier onlyOwner(address sender) {
        require(sender == _owner, "You're not the owner of the contract.");
        _;
    }

    modifier onlyFactory() {
        require(msg.sender == _factory, "You need to use the factory.");
        _;
    }

    // Function to receive Ether. msg.data must be empty
    receive() external payable {}

    // Fallback function is called when msg.data is not empty
    fallback() external payable {}

    function getBalance() public view returns (uint) {
        return address(this).balance;
    }

    function transfer() public payable onlyFactory {
        payable(address(this)).transfer(msg.value);
        _raisedAmount += msg.value;

        if (_raisedAmount >= _goal) {
            emit GoalReached(_owner, _goal, _raisedAmount);
        }
    }
    
    function withdraw(address sender) public onlyOwner(sender) minWithdrawAmount {
        payable(_owner).transfer(_raisedAmount);
        _raisedAmount = 0;
    }

}

contract DonationFactory {

    mapping (string => Donation) _donations;
    string[] _donationsNames;
    Donation[] _donationsAddresses;

    function createDonation(string memory name, uint goal, address owner) public {
        _donations[name] = new Donation(goal, owner);

        _donationsNames.push(name);
        _donationsAddresses.push(_donations[name]);
    }

    function getDonationsNames() public view returns (string[] memory) {
        return _donationsNames;
    }

    function getDonationsAddresses() public view returns (Donation[] memory) {
        return _donationsAddresses;
    }

    function donateByName(string memory name) public payable {
        _donations[name].transfer{value : msg.value}();
    }

    function withdrawByName(string memory name) public {
        _donations[name].withdraw(msg.sender);
    }

    function getBalanceByDonationName(string memory name) public view returns (uint) {
        return _donations[name].getBalance();
    }

    function getGoalByDonationName(string memory name) public view returns (uint) {
        return _donations[name]._goal();
    }
}