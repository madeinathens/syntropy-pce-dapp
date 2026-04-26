/**
 * Minimal ABI for SYNTROPY_PCE contracts.
 * Only the functions, events, and view methods the dApp needs.
 *
 * Generated from SYNTROPY_PCE_15.sol — same shape applies to all
 * future PCE contracts (#16, #17, ...).
 */
export const pceAbi = [
  // ───── reads ─────
  {
    type: 'function',
    name: 'getCellState',
    inputs: [],
    outputs: [
      { name: 'step',       type: 'uint256' },
      { name: 'lastAction', type: 'uint256' },
      { name: 'isDead',     type: 'bool'    },
      { name: 'epoch',      type: 'uint256' },
      { name: 'holder',     type: 'address' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'getPoolBalances',
    inputs: [],
    outputs: [
      { name: 'erc20OwnerBalance', type: 'uint256' },
      { name: 'usdcBalance',       type: 'uint256' },
      { name: 'ethBalance',        type: 'uint256' },
    ],
    stateMutability: 'view',
  },
  { type: 'function', name: 'tokenStep',            inputs: [], outputs: [{ type: 'uint256' }], stateMutability: 'view' },
  { type: 'function', name: 'tokenEpoch',           inputs: [], outputs: [{ type: 'uint256' }], stateMutability: 'view' },
  { type: 'function', name: 'deadCell',             inputs: [], outputs: [{ type: 'bool'    }], stateMutability: 'view' },
  { type: 'function', name: 'lastMitosisTimestamp', inputs: [], outputs: [{ type: 'uint256' }], stateMutability: 'view' },
  { type: 'function', name: 'isEvicted',            inputs: [], outputs: [{ type: 'bool'    }], stateMutability: 'view' },
  { type: 'function', name: 'SACRED_TOKEN_ID',      inputs: [], outputs: [{ type: 'uint256' }], stateMutability: 'view' },
  { type: 'function', name: 'TOTAL_STEPS',          inputs: [], outputs: [{ type: 'uint256' }], stateMutability: 'view' },
  {
    type: 'function',
    name: 'hasClaimedBonus',
    inputs: [{ name: 'holder', type: 'address' }],
    outputs: [{ type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'owner',
    inputs: [],
    outputs: [{ type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'consumedReceipts',
    inputs: [{ name: '', type: 'bytes32' }],
    outputs: [{ type: 'bool' }],
    stateMutability: 'view',
  },

  // ───── writes ─────
  { type: 'function', name: 'claimEntryBonus',   inputs: [], outputs: [], stateMutability: 'nonpayable' },
  { type: 'function', name: 'autonomousBuyback', inputs: [], outputs: [], stateMutability: 'nonpayable' },
  { type: 'function', name: 'killDeadCell',      inputs: [], outputs: [], stateMutability: 'nonpayable' },
  {
    type: 'function',
    name: 'executePCE',
    inputs: [
      { name: 'receiptHash', type: 'bytes32' },
      { name: 'signature',   type: 'bytes'   },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },

  // ───── events ─────
  {
    type: 'event',
    name: 'MitosisExecuted',
    inputs: [
      { name: 'holder',             type: 'address', indexed: true },
      { name: 'step',               type: 'uint256', indexed: false },
      { name: 'amountDistributed',  type: 'uint256', indexed: false },
    ],
  },
  {
    type: 'event',
    name: 'EntryBonusClaimed',
    inputs: [
      { name: 'holder', type: 'address', indexed: true },
      { name: 'epoch',  type: 'uint256', indexed: false },
    ],
  },
  {
    type: 'event',
    name: 'CellRecycled',
    inputs: [
      { name: 'previousHolder', type: 'address', indexed: true },
      { name: 'refundAmount',   type: 'uint256', indexed: false },
      { name: 'stepsConsumed',  type: 'uint256', indexed: false },
    ],
  },
  {
    type: 'event',
    name: 'ApoptosisTriggered',
    inputs: [
      { name: 'failedHolder', type: 'address', indexed: true },
      { name: 'reason',       type: 'string',  indexed: false },
    ],
  },
] as const

/**
 * Minimal ERC721 ABI — for reading current holder of a tokenId.
 */
export const erc721Abi = [
  {
    type: 'function',
    name: 'ownerOf',
    inputs: [{ name: 'tokenId', type: 'uint256' }],
    outputs: [{ type: 'address' }],
    stateMutability: 'view',
  },
] as const
