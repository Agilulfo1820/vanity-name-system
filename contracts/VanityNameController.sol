// SPDX-License-Identifier: UNLICENSED

pragma solidity 0.8.4;

import "@openzeppelin/contracts/utils/Address.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract VanityNameController {
    using Address for address;
    using Strings for uint256;

    /** Constants **/
    uint256 internal constant SECONDS_IN_A_DAY = 86400;
    uint256 internal constant FEE_AMOUNT_IN_WEI = 10000000000000000;

    /** Data Structures and values **/
    struct VanityName {
        string name;
        uint256 endTime;
        address owner;
    }

    VanityName[] vanityNameStorage;

    // Mapping from vanity name to owner address
    mapping(string => address) owners;
    mapping(address => string[]) ownerOfNames;

    /** Events **/
    event NewBuy(string vanityName, address owner, uint256 endTime, uint256 fee);
    event MessageValue(uint256 value);

    /** Internal functions and modifiers **/
    function _exists(string memory vanityName) internal view returns (bool) {
        return owners[vanityName] != address(0);
    }

    /** Smart contract functions **/

    //reserve function to avoid frontrunning
    //user needs to pass his address, name,
    function reserve() public {
        //used to solve concurrency
        uint256 timestamp = block.timestamp;
    }

    function buy(string memory vanityName) public payable {
        require(!_exists(vanityName), "VanityNameController: vanity name already in use.");

        uint256 fee = getVanityNameFee(vanityName);
        require(msg.value >= fee, "VanityNameController: ETH sent are not enough to buy the vanity name.");

        //Save new vanity name
        uint256 newEndTime = block.timestamp + 365 days;
        VanityName memory vanityNameStruct = VanityName(vanityName, newEndTime, msg.sender);
        vanityNameStorage.push(vanityNameStruct);

        //Set owner
        owners[vanityName] = msg.sender;
        ownerOfNames[msg.sender].push(vanityName);

        emit NewBuy(vanityName, msg.sender, newEndTime, fee);
    }

    function ownerOf(string memory vanityName) public view returns (address) {
        address owner = owners[vanityName];
        require(owner != address(0), "ownerOf: owner query for nonexistent vanity name");
        //TODO:Check the end_time
        return owner;
    }

    function checkAvailability(string memory vanityName) public view returns (bool) {
        address owner = owners[vanityName];
        //TODO:Check the end_time
        if (owner != address(0)) {
            return false;
        } else {
            return true;
        }
    }

    function getVanityNames() public view returns (VanityName[] memory) {
        return vanityNameStorage;
    }

    function getVanityNameFee(string memory vanityName)  public view returns (uint256) {
        return bytes(vanityName).length * FEE_AMOUNT_IN_WEI;
    }

    function getVanityNamesOf(address userAddress) public view returns (string[] memory) {
        return ownerOfNames[userAddress];
    }
}