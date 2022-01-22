// SPDX-License-Identifier: UNLICENSED

pragma solidity 0.8.4;

import "@openzeppelin/contracts/utils/Address.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract VanityNameController {
    using Address for address;
    using Strings for uint256;

    /** Constants **/
    uint256 internal constant SECONDS_IN_A_DAY = 86400;//time = block.timestamp % SECONDS_IN_A_DAY
    uint256 internal constant FEE_AMOUNT_IN_WEI = 100000000000;

    /** Data Structures and values **/
    struct VanityName {
        string name;
        uint256 endTime;
        address creatorAddress;
    }

    VanityName[] vanityNameStorage;

    // Mapping from vanity name to owner address
    mapping(string => address) _owners;

    // TODO:Mi serve una roba più simile ai token di un certo brand, quindi una lista di nomi

    /** Events **/
    event NewBuy(string vanityName, address owner, uint256 endTime, uint256 fee);
    event MessageValue(uint256 value);

    /** Internal functions and modifiers **/
    function _exists(string memory vanityName) internal view returns (bool) {
        return _owners[vanityName] != address(0);
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

        uint256 fee = getFeeFor(vanityName);
        emit MessageValue(msg.value);
        require(msg.value >= fee, "VanityNameController: ETH sent are not enough to buy the vanity name.");

        //Save new vanity name
        uint256 newEndTime = block.timestamp + 365 days;
        VanityName memory vanityNameStruct = VanityName(vanityName, newEndTime, msg.sender);
        vanityNameStorage.push(vanityNameStruct);

        //Set owner
        _owners[vanityName] = msg.sender;

        emit NewBuy(vanityName, msg.sender, newEndTime, fee);
    }

    function ownerOf(string memory vanityName) public view returns (address) {
        address owner = _owners[vanityName];
        require(owner != address(0), "ownerOf: owner query for nonexistent vanity name");
        return owner;
    }

    function getFeeFor(string memory vanityName)  public view returns (uint256) {
        return bytes(vanityName).length * FEE_AMOUNT_IN_WEI;
    }
}