// SPDX-License-Identifier: UNLICENSED

pragma solidity 0.8.4;

import "@openzeppelin/contracts/utils/Address.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract VanityNameController {
    using Address for address;
    using Strings for uint256;
    using Counters for Counters.Counter;

    /** Data Structures and values **/
    uint256 internal constant FEE_AMOUNT_IN_WEI = 10000000000000000;
    uint256 internal constant SUBSCRIPTION_PERIOD = 5 seconds;

    struct VanityName {
        uint256 id;
        string name;
        uint256 expiresAt;
    }

    VanityName[] vanityNameStorage;

    // Mappings
    mapping(string => address) owners;
    mapping(string => uint256) vanityNameIds;
    mapping(address => uint256) totalStakedBalance;
    mapping(bytes32 => uint) public commitments;

    Counters.Counter counter;

    /** Events **/
    event NewBuy(string vanityName, address newOwner, uint256 expiresAt, uint256 fee);
    event FeesWithdrawn(string vanityName, address user, uint256 amount);
    event VanityNameRenewed(string vanityName, address owner, uint256 expiresAt);

    /** Internal functions and modifiers **/
    function _exists(string memory vanityName) internal view returns (bool) {
        return owners[vanityName] != address(0);
    }

    function _expired(string memory vanityName) internal view returns (bool) {
        if (!_exists(vanityName)) {
            return true;
        }
        uint256 id = vanityNameIds[vanityName];

        return vanityNameStorage[id].expiresAt < block.timestamp;
    }

    /** Smart contract functions **/
    function makeCommitment(string memory name, address owner, bytes32 secret) public pure returns (bytes32) {
        //create new reservation
        bytes32 label = keccak256(bytes(name));
        return keccak256(abi.encodePacked(label, owner, secret));
    }

    function commit(bytes32 commitment) public {
        require(commitments[commitment] < block.timestamp);
        commitments[commitment] = block.timestamp;
    }

    function consumeCommitment(string memory name, bytes32 commitment) internal {
        // Require a valid commitment
        require(commitments[commitment] <= block.timestamp);

        require(checkAvailability(name));

        delete (commitments[commitment]);
    }

    function buy(string memory vanityName, address user, bytes32 secret) public payable {
        require(_expired(vanityName), "VanityNameController: vanity name already in use.");

        bytes32 commitment = makeCommitment(vanityName, user, secret);
        consumeCommitment(vanityName, commitment);

        uint256 fee = getFee(vanityName);
        require(msg.value >= fee, "VanityNameController: ETH sent are not enough to buy the vanity name.");

        //Save new vanity name
        uint256 newEndTime = block.timestamp + SUBSCRIPTION_PERIOD;

        //If name was already registered previously then it already has an id, otherwise generate it
        if (!_exists(vanityName)) {
            uint256 id = counter.current();
            counter.increment();

            VanityName memory vanityNameStruct = VanityName(id, vanityName, newEndTime);
            vanityNameStorage.push(vanityNameStruct);

            vanityNameIds[vanityName] = id;
        }

        //Set owner
        owners[vanityName] = msg.sender;

        //Lock fee
        totalStakedBalance[msg.sender] = totalStakedBalance[msg.sender] + msg.value;

        emit NewBuy(vanityName, msg.sender, newEndTime, fee);
    }

    function withdrawFee(string memory vanityName) public payable {
        uint256 fee = getFee(vanityName);

        //require
        require(_exists(vanityName), "VanityNameController: you cannot withdraw fees for a non existing vanity name");
        require(ownerOf(vanityName) == msg.sender, "VanityNameController: you must be the owner of the vanity name");
        require(_expired(vanityName), "VanityNameController: subscription period must expire in order to withdraw fee");
        require(totalStakedBalance[msg.sender] >= fee, "VanityNameController: Balance unavailable to withdraw fee");

        //remove as owner of vanityName
        owners[vanityName] = address(0);

        //send staked amount for that vanityName
        totalStakedBalance[msg.sender] = totalStakedBalance[msg.sender] - fee;
        payable(msg.sender).transfer(fee);

        emit FeesWithdrawn(vanityName, msg.sender, fee);
    }

    function renew(string memory nameToRenew) public payable {
        require(ownerOf(nameToRenew) == msg.sender, "VanityNameController: you must be the owner of the vanity name");

        uint256 newEndTime = block.timestamp + SUBSCRIPTION_PERIOD;
        uint256 id = vanityNameIds[nameToRenew];
        VanityName storage vanityName = vanityNameStorage[id];
        vanityName.expiresAt = newEndTime;

        emit VanityNameRenewed(nameToRenew, msg.sender, vanityNameStorage[id].expiresAt);
    }

    /** Getters **/
    function ownerOf(string memory vanityName) public view returns (address) {
        return owners[vanityName];
    }

    function checkAvailability(string memory vanityName) public view returns (bool) {
        address owner = owners[vanityName];
        if (owner != address(0) && !_expired(vanityName)) {
            return false;
        } else {
            return true;
        }
    }

    function index() public view returns (VanityName[] memory) {
        return vanityNameStorage;
    }

    function get(string memory vanityName) public view returns (VanityName memory) {
        uint256 id = getId(vanityName);
        return vanityNameStorage[id];
    }

    function getFee(string memory vanityName) public pure returns (uint256) {
        return bytes(vanityName).length * FEE_AMOUNT_IN_WEI;
    }

    function getId(string memory vanityName) public view returns (uint256) {
        return vanityNameIds[vanityName];
    }

    function getVanityNameById(uint256 id) public view returns (VanityName memory) {
        return vanityNameStorage[id];
    }

    function getTotalStakedAmount(address user) public view returns (uint256) {
        return totalStakedBalance[user];
    }
}