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

# To Go Further

- Check for EIP 677
- Check for rune coin exploit (using tx.origin)

# Challenge

Try to use a malicious contract that manages to pull funds from somebody using the tx.origin instead of msg.sender
