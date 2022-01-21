// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.4;

import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract VanityNameSystem is Ownable, Pausable {
    /**
     * @dev Pause the contract
    */
    function pause() public onlyOwner {
        _pause();
    }

    /**
     * @dev Unpause the contract
    */
    function unpause() public onlyOwner {
        _unpause();
    }
}