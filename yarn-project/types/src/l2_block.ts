import {
  AppendOnlyTreeSnapshot,
  KERNEL_NEW_COMMITMENTS_LENGTH,
  KERNEL_NEW_CONTRACTS_LENGTH,
  KERNEL_NEW_NULLIFIERS_LENGTH,
  STATE_TRANSITIONS_LENGTH,
} from '@aztec/circuits.js';
import { makeAppendOnlyTreeSnapshot } from '@aztec/circuits.js/factories';
import { BufferReader, serializeToBuffer } from '@aztec/circuits.js/utils';
import { Fr } from '@aztec/foundation';
import times from 'lodash.times';
import { ContractData } from './contract_data.js';
import { L2Tx } from './l2_tx.js';
import { PublicDataWrite } from './public_data_write.js';

/**
 * The data that makes up the rollup proof, with encoder decoder functions.
 * TODO: Reuse data types and serialization functions from circuits package.
 */
export class L2Block {
  /**
   * Construct a new L2Block object.
   * The data that goes into the rollup, BUT without the proof.
   * @param number - The number of the L2 block.
   * @param startPrivateDataTreeSnapshot - The tree snapshot of the private data tree at the start of the rollup.
   * @param startNullifierTreeSnapshot - The tree snapshot of the nullifier tree at the start of the rollup.
   * @param startContractTreeSnapshot - The tree snapshot of the contract tree at the start of the rollup.
   * @param startTreeOfHistoricPrivateDataTreeRootsSnapshot - The tree snapshot of the historic private data tree roots at the start of the rollup.
   * @param startTreeOfHistoricContractTreeRootsSnapshot - The tree snapshot of the historic contract tree roots at the start of the rollup.
   * @param startPublicDataTreeRoot - The tree root of the public data tree at the start of the rollup.
   * @param endPrivateDataTreeSnapshot - The tree snapshot of the private data tree at the end of the rollup.
   * @param endNullifierTreeSnapshot - The tree snapshot of the nullifier tree at the end of the rollup.
   * @param endContractTreeSnapshot - The tree snapshot of the contract tree at the end of the rollup.
   * @param endTreeOfHistoricPrivateDataTreeRootsSnapshot - The tree snapshot of the historic private data tree roots at the end of the rollup.
   * @param endTreeOfHistoricContractTreeRootsSnapshot - The tree snapshot of the historic contract tree roots at the end of the rollup.
   * @param endPublicDataTreeRoot - The tree root of the public data tree at the end of the rollup.
   * @param newCommitments - The commitments to be inserted into the private data tree.
   * @param newNullifiers - The nullifiers to be inserted into the nullifier tree.
   * @param newPublicDataWrites - The public data writes to be inserted into the public data tree.
   * @param newContracts - The contracts leafs to be inserted into the contract tree.
   * @param newContractData - The aztec_address and eth_address for the deployed contract and its portal contract.
   */
  constructor(
    public number: number,
    public startPrivateDataTreeSnapshot: AppendOnlyTreeSnapshot,
    public startNullifierTreeSnapshot: AppendOnlyTreeSnapshot,
    public startContractTreeSnapshot: AppendOnlyTreeSnapshot,
    public startTreeOfHistoricPrivateDataTreeRootsSnapshot: AppendOnlyTreeSnapshot,
    public startTreeOfHistoricContractTreeRootsSnapshot: AppendOnlyTreeSnapshot,
    public startPublicDataTreeRoot: Fr,
    public endPrivateDataTreeSnapshot: AppendOnlyTreeSnapshot,
    public endNullifierTreeSnapshot: AppendOnlyTreeSnapshot,
    public endContractTreeSnapshot: AppendOnlyTreeSnapshot,
    public endTreeOfHistoricPrivateDataTreeRootsSnapshot: AppendOnlyTreeSnapshot,
    public endTreeOfHistoricContractTreeRootsSnapshot: AppendOnlyTreeSnapshot,
    public endPublicDataTreeRoot: Fr,
    public newCommitments: Fr[],
    public newNullifiers: Fr[],
    public newPublicDataWrites: PublicDataWrite[],
    public newContracts: Fr[],
    public newContractData: ContractData[],
  ) {}

  static random(l2BlockNum: number, txsPerBlock = 1) {
    const newNullifiers = times(KERNEL_NEW_NULLIFIERS_LENGTH * txsPerBlock, Fr.random);
    const newCommitments = times(KERNEL_NEW_COMMITMENTS_LENGTH * txsPerBlock, Fr.random);
    const newContracts = times(KERNEL_NEW_CONTRACTS_LENGTH * txsPerBlock, Fr.random);
    const newContractData = times(KERNEL_NEW_CONTRACTS_LENGTH * txsPerBlock, ContractData.random);
    const newPublicDataWrites = times(STATE_TRANSITIONS_LENGTH * txsPerBlock, PublicDataWrite.random);

    return L2Block.fromFields({
      number: l2BlockNum,
      startPrivateDataTreeSnapshot: makeAppendOnlyTreeSnapshot(0),
      startNullifierTreeSnapshot: makeAppendOnlyTreeSnapshot(0),
      startContractTreeSnapshot: makeAppendOnlyTreeSnapshot(0),
      startPublicDataTreeRoot: Fr.random(),
      startTreeOfHistoricPrivateDataTreeRootsSnapshot: makeAppendOnlyTreeSnapshot(0),
      startTreeOfHistoricContractTreeRootsSnapshot: makeAppendOnlyTreeSnapshot(0),
      endPrivateDataTreeSnapshot: makeAppendOnlyTreeSnapshot(newCommitments.length),
      endNullifierTreeSnapshot: makeAppendOnlyTreeSnapshot(newNullifiers.length),
      endContractTreeSnapshot: makeAppendOnlyTreeSnapshot(newContracts.length),
      endPublicDataTreeRoot: Fr.random(),
      endTreeOfHistoricPrivateDataTreeRootsSnapshot: makeAppendOnlyTreeSnapshot(1),
      endTreeOfHistoricContractTreeRootsSnapshot: makeAppendOnlyTreeSnapshot(1),
      newCommitments,
      newNullifiers,
      newContracts,
      newContractData,
      newPublicDataWrites,
    });
  }

  /**
   * Constructs a new instance from named fields.
   * @param fields - Fields to pass to the constructor.
   * @returns A new instance.
   */
  static fromFields(fields: {
    number: number;
    startPrivateDataTreeSnapshot: AppendOnlyTreeSnapshot;
    startNullifierTreeSnapshot: AppendOnlyTreeSnapshot;
    startContractTreeSnapshot: AppendOnlyTreeSnapshot;
    startTreeOfHistoricPrivateDataTreeRootsSnapshot: AppendOnlyTreeSnapshot;
    startTreeOfHistoricContractTreeRootsSnapshot: AppendOnlyTreeSnapshot;
    startPublicDataTreeRoot: Fr;
    endPrivateDataTreeSnapshot: AppendOnlyTreeSnapshot;
    endNullifierTreeSnapshot: AppendOnlyTreeSnapshot;
    endContractTreeSnapshot: AppendOnlyTreeSnapshot;
    endTreeOfHistoricPrivateDataTreeRootsSnapshot: AppendOnlyTreeSnapshot;
    endTreeOfHistoricContractTreeRootsSnapshot: AppendOnlyTreeSnapshot;
    endPublicDataTreeRoot: Fr;
    newCommitments: Fr[];
    newNullifiers: Fr[];
    newPublicDataWrites: PublicDataWrite[];
    newContracts: Fr[];
    newContractData: ContractData[];
  }) {
    return new this(
      fields.number,
      fields.startPrivateDataTreeSnapshot,
      fields.startNullifierTreeSnapshot,
      fields.startContractTreeSnapshot,
      fields.startTreeOfHistoricPrivateDataTreeRootsSnapshot,
      fields.startTreeOfHistoricContractTreeRootsSnapshot,
      fields.startPublicDataTreeRoot,
      fields.endPrivateDataTreeSnapshot,
      fields.endNullifierTreeSnapshot,
      fields.endContractTreeSnapshot,
      fields.endTreeOfHistoricPrivateDataTreeRootsSnapshot,
      fields.endTreeOfHistoricContractTreeRootsSnapshot,
      fields.endPublicDataTreeRoot,
      fields.newCommitments,
      fields.newNullifiers,
      fields.newPublicDataWrites,
      fields.newContracts,
      fields.newContractData,
    );
  }

  /**
   * Encode the L2 block data into a buffer that can be pushed to the rollup contract.
   * @returns The encoded L2 block data.
   */
  encode(): Buffer {
    return serializeToBuffer(
      this.number,
      this.startPrivateDataTreeSnapshot,
      this.startNullifierTreeSnapshot,
      this.startContractTreeSnapshot,
      this.startTreeOfHistoricPrivateDataTreeRootsSnapshot,
      this.startTreeOfHistoricContractTreeRootsSnapshot,
      this.startPublicDataTreeRoot,
      this.endPrivateDataTreeSnapshot,
      this.endNullifierTreeSnapshot,
      this.endContractTreeSnapshot,
      this.endTreeOfHistoricPrivateDataTreeRootsSnapshot,
      this.endTreeOfHistoricContractTreeRootsSnapshot,
      this.endPublicDataTreeRoot,
      this.newCommitments.length,
      this.newCommitments,
      this.newNullifiers.length,
      this.newNullifiers,
      this.newPublicDataWrites.length,
      this.newPublicDataWrites,
      this.newContracts.length,
      this.newContracts,
      this.newContractData,
    );
  }

  /**
   * Alias for encode.
   * @returns The encoded L2 block data.
   */
  toBuffer() {
    return this.encode();
  }

  /**
   * Decode the L2 block data from a buffer.
   * @param encoded - The encoded L2 block data.
   * @returns The decoded L2 block data.
   */
  static decode(encoded: Buffer | BufferReader) {
    const reader = BufferReader.asReader(encoded);
    const number = reader.readNumber();
    const startPrivateDataTreeSnapshot = reader.readObject(AppendOnlyTreeSnapshot);
    const startNullifierTreeSnapshot = reader.readObject(AppendOnlyTreeSnapshot);
    const startContractTreeSnapshot = reader.readObject(AppendOnlyTreeSnapshot);
    const startTreeOfHistoricPrivateDataTreeRootsSnapshot = reader.readObject(AppendOnlyTreeSnapshot);
    const startTreeOfHistoricContractTreeRootsSnapshot = reader.readObject(AppendOnlyTreeSnapshot);
    const startPublicDataTreeRoot = reader.readObject(Fr);
    const endPrivateDataTreeSnapshot = reader.readObject(AppendOnlyTreeSnapshot);
    const endNullifierTreeSnapshot = reader.readObject(AppendOnlyTreeSnapshot);
    const endContractTreeSnapshot = reader.readObject(AppendOnlyTreeSnapshot);
    const endTreeOfHistoricPrivateDataTreeRootsSnapshot = reader.readObject(AppendOnlyTreeSnapshot);
    const endTreeOfHistoricContractTreeRootsSnapshot = reader.readObject(AppendOnlyTreeSnapshot);
    const endPublicDataTreeRoot = reader.readObject(Fr);
    const newCommitments = reader.readVector(Fr);
    const newNullifiers = reader.readVector(Fr);
    const newPublicDataWrites = reader.readVector(PublicDataWrite);
    const newContracts = reader.readVector(Fr);
    const newContractData = reader.readArray(newContracts.length, ContractData);

    return L2Block.fromFields({
      number,
      startPrivateDataTreeSnapshot,
      startNullifierTreeSnapshot,
      startContractTreeSnapshot,
      startTreeOfHistoricPrivateDataTreeRootsSnapshot,
      startTreeOfHistoricContractTreeRootsSnapshot,
      startPublicDataTreeRoot,
      endPrivateDataTreeSnapshot,
      endNullifierTreeSnapshot,
      endContractTreeSnapshot,
      endTreeOfHistoricPrivateDataTreeRootsSnapshot,
      endTreeOfHistoricContractTreeRootsSnapshot,
      endPublicDataTreeRoot,
      newCommitments,
      newNullifiers,
      newPublicDataWrites,
      newContracts,
      newContractData,
    });
  }

  /**
   * Get the ith transaction in an L2 block.
   * @param txIndex - The index of the tx in the block.
   * @returns The tx.
   */
  getTx(txIndex: number) {
    const numTxs = Math.floor(this.newCommitments.length / KERNEL_NEW_COMMITMENTS_LENGTH);
    if (txIndex >= numTxs) {
      throw new Error(`Failed to get tx ${txIndex}. Block ${this.number} only has ${numTxs} txs.`);
    }

    const newCommitments = this.newCommitments.slice(
      KERNEL_NEW_COMMITMENTS_LENGTH * txIndex,
      KERNEL_NEW_COMMITMENTS_LENGTH * (txIndex + 1),
    );
    const newNullifiers = this.newNullifiers.slice(
      KERNEL_NEW_NULLIFIERS_LENGTH * txIndex,
      KERNEL_NEW_NULLIFIERS_LENGTH * (txIndex + 1),
    );
    const newPublicDataWrites = this.newPublicDataWrites.slice(
      STATE_TRANSITIONS_LENGTH * txIndex,
      STATE_TRANSITIONS_LENGTH * (txIndex + 1),
    );
    const newContracts = this.newContracts.slice(
      KERNEL_NEW_CONTRACTS_LENGTH * txIndex,
      KERNEL_NEW_CONTRACTS_LENGTH * (txIndex + 1),
    );
    const newContractData = this.newContractData.slice(
      KERNEL_NEW_CONTRACTS_LENGTH * txIndex,
      KERNEL_NEW_CONTRACTS_LENGTH * (txIndex + 1),
    );

    return new L2Tx(newCommitments, newNullifiers, newPublicDataWrites, newContracts, newContractData);
  }

  /**
   * Inspect for debugging purposes..
   * @param maxBufferSize - The number of bytes to be extracted from buffer.
   * @returns A human-friendly string representation of the l2Block.
   */
  inspect(maxBufferSize = 4): string {
    const inspectHex = (fr: { toBuffer: () => Buffer }): string =>
      `0x${fr.toBuffer().subarray(0, maxBufferSize).toString('hex')}`;
    const inspectArray = <T>(arr: T[], inspector: (t: T) => string) => '[' + arr.map(inspector).join(', ') + ']';

    const inspectTreeSnapshot = (s: AppendOnlyTreeSnapshot): string =>
      `(${s.nextAvailableLeafIndex}, ${inspectHex(s.root)})`;
    const inspectFrArray = (arr: Fr[]): string => inspectArray(arr, inspectHex);
    const inspectContractDataArray = (arr: ContractData[]): string =>
      inspectArray(arr, cd => `(${inspectHex(cd.contractAddress)}, ${inspectHex(cd.portalContractAddress)})`);
    const inspectPublicDataWriteArray = (arr: PublicDataWrite[]): string =>
      inspectArray(arr, pdw => `(${inspectHex(pdw.leafIndex)}, ${inspectHex(pdw.newValue)})`);

    return [
      `L2Block`,
      `number: ${this.number}`,
      `startPrivateDataTreeSnapshot: ${inspectTreeSnapshot(this.startPrivateDataTreeSnapshot)}`,
      `startNullifierTreeSnapshot: ${inspectTreeSnapshot(this.startNullifierTreeSnapshot)}`,
      `startContractTreeSnapshot: ${inspectTreeSnapshot(this.startContractTreeSnapshot)}`,
      `startTreeOfHistoricPrivateDataTreeRootsSnapshot: ${inspectTreeSnapshot(
        this.startTreeOfHistoricPrivateDataTreeRootsSnapshot,
      )}`,
      `startTreeOfHistoricContractTreeRootsSnapshot: ${inspectTreeSnapshot(
        this.startTreeOfHistoricContractTreeRootsSnapshot,
      )}`,
      `startPublicDataTreeRoot: ${this.startPublicDataTreeRoot.toString()}`,
      `endPrivateDataTreeSnapshot: ${inspectTreeSnapshot(this.endPrivateDataTreeSnapshot)}`,
      `endNullifierTreeSnapshot: ${inspectTreeSnapshot(this.endNullifierTreeSnapshot)}`,
      `endContractTreeSnapshot: ${inspectTreeSnapshot(this.endContractTreeSnapshot)}`,
      `endTreeOfHistoricPrivateDataTreeRootsSnapshot: ${inspectTreeSnapshot(
        this.endTreeOfHistoricPrivateDataTreeRootsSnapshot,
      )}`,
      `endTreeOfHistoricContractTreeRootsSnapshot: ${inspectTreeSnapshot(
        this.endTreeOfHistoricContractTreeRootsSnapshot,
      )}`,
      `endPublicDataTreeRoot: ${this.endPublicDataTreeRoot.toString()}`,
      `newCommitments: ${inspectFrArray(this.newCommitments)}`,
      `newNullifiers: ${inspectFrArray(this.newNullifiers)}`,
      `newPublicDataWrite: ${inspectPublicDataWriteArray(this.newPublicDataWrites)}`,
      `newContracts: ${inspectFrArray(this.newContracts)}`,
      `newContractData: ${inspectContractDataArray(this.newContractData)}`,
    ].join('\n');
  }
}
