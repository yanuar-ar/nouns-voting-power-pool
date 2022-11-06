// SPDX-License-Identifier: MIT
pragma solidity ^0.8.6;

interface INounsDAOLogic {
    function castVote(uint256 proposalId, uint8 support) external;

    function castVoteWithReason(
        uint256 proposalId,
        uint8 support,
        string calldata reason
    ) external;

    function propose(
        address[] memory targets,
        uint256[] memory values,
        string[] memory signatures,
        bytes[] memory calldatas,
        string memory description
    ) external returns (uint256);
}
