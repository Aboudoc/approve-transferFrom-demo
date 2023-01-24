# Sample Hardhat Project

This project demonstrates a basic Hardhat use case. It comes with a sample contract, a test for that contract, and a script that deploys that contract.

Try running some of the following tasks:

```shell
npx hardhat help
npx hardhat test
REPORT_GAS=true npx hardhat test
npx hardhat node
npx hardhat run scripts/deploy.js
```

# unchecked

When we create a block for unchecked with solidity 0.7 and below, we wouldn't check if we're going below 0.

Use it if you know there won't be overflow and to save on gas

Use require to check there is enough balance to tranfer.

```shell
function transfer(address recipient, uint amount) external {
    unchecked {
        // require(balances[msg.sender] >= amount);
        balances[recipient] += amount;
        balances[msg.sender] -= amount;
    }
}
```

# To Go Further

-- Check for EIP 677: transferAndCall Token Standard --

This adds a new function to ERC20 token contracts, transferAndCall which can be called to transfer tokens to a contract and then call the contract with the additional data provided. Once the token is transferred, the token contract calls the receiving contract's function onTokenTransfer(address,uint256,bytes) and triggers an event Transfer(address,address,uint,bytes), following the convention set in ERC223

- transferAndCall

```shell
function transferAndCall(address receiver, uint amount, bytes data) returns (bool success)
```

Transfers tokens to receiver, via ERC20's transfer(address,uint256) function. It then logs an event Transfer(address,address,uint256,bytes). Once the transfer has succeeded and the event is logged, the token calls onTokenTransfer(address,uint256,bytes) on the receiver with the sender, the amount approved, and additional bytes data as parameters.

- onTokenTransfer

```shell
function onTokenTransfer(address from, uint256 amount, bytes data) returns (bool success)
```

The function is added to contracts enabling them to react to receiving tokens within a single transaction. The from parameter is the account which just trasfered amount from the token contract. data is available to pass additional parameters, i.e. to indicate what the intention of the transfer is if a contract allows transfers for multiple reasons.

-- Check for rune coin exploit (using tx.origin) --
https://docs.soliditylang.org/en/develop/security-considerations.html#tx-origin

https://solidity-by-example.org/hacks/phishing-with-tx-origin/

# Challenge

Try to use a malicious contract that manages to pull funds from somebody using the tx.origin instead of msg.sender
