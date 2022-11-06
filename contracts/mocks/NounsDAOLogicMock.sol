// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.6;

contract NounsDAOLogicMock {
    function propose(
        address[] memory targets,
        uint256[] memory values,
        string[] memory signatures,
        bytes[] memory calldatas,
        string memory description
    ) public returns (uint256) {
        return 1;
    }

    function castVote(uint256 proposalId, uint8 support) external {}

    function castVoteWithReason(
        uint256 proposalId,
        uint8 support,
        string calldata reason
    ) external {}
}
