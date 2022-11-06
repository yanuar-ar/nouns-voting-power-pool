// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import '@openzeppelin/contracts/access/Ownable.sol';
import './interfaces/IVotingPowerPool.sol';

import './VotingPowerPool.sol';

contract VotingPowerFactory is Ownable {
    address public immutable nounsDAOLogic;
    address public immutable nounsToken;

    event PoolCreated(address indexed pool, address indexed owner);

    constructor(address _nounsDAOLogic, address _nounsToken) {
        nounsDAOLogic = _nounsDAOLogic;
        nounsToken = _nounsToken;
    }

    function createPool() external returns (address pool) {
        pool = address(new VotingPowerPool(nounsDAOLogic, nounsToken));
        IVotingPowerPool(pool).initialize(msg.sender);
        emit PoolCreated(pool, msg.sender);
    }
}
