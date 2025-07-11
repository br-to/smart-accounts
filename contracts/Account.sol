// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

import "@account-abstraction/contracts/core/EntryPoint.sol";
import "@account-abstraction/contracts/interfaces/IAccount.sol";

contract Account is IAccount {
    uint public count;
    address public owner;

    constructor(address _owner) {
        owner = _owner;
    }

    function validateUserOp(PackedUserOperation calldata userOp,
        bytes32,
        uint256
    ) external pure returns (uint256 validationData) {
        // This is a placeholder implementation.
        // In a real contract, you would implement the logic to validate the user operation.
        // For now, we return 0 to indicate success.
        return 0; // SIG_VALIDATION_FAILED (1) would indicate a signature failure.
    }

    function execute() external {
        count++;
    }
}

contract AccountFactory {
  function createAccount(address owner) external returns (address) {
    Account account = new Account(owner);
    return address(account);
  }
}
