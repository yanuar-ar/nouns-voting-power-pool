// SPDX-License-Identifier: MIT
pragma solidity ^0.8.6;

import { IERC721 } from '@openzeppelin/contracts/token/ERC721/IERC721.sol';

interface INounsToken is IERC721 {
    function getPriorVotes(address account, uint256 blockNumber) external view returns (uint96);

    function delegates(address delegator) external view returns (address);

    function votesToDelegate(address delegator) external view returns (uint96);
}
