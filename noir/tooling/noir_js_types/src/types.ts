import { Abi } from '@noir-lang/noirc_abi';

export { Abi, WitnessMap } from '@noir-lang/noirc_abi';

export interface Backend {
  /**
   * @description Generates a proof */
  generateProof(decompressedWitness: Uint8Array): Promise<ProofData>;

  /**
   *
   * @description Retrieves the artifacts from a proof in the Field format
   */
  generateRecursiveProofArtifacts(
    proofData: ProofData,
    numOfPublicInputs: number,
  ): Promise<{
    /** @description An array of Fields containing the proof */
    proofAsFields: string[];
    /** @description An array of Fields containing the verification key */
    vkAsFields: string[];
    /** @description A Field containing the verification key hash */
    vkHash: string;
  }>;

  /**
   * @description Verifies a proof */
  verifyProof(proofData: ProofData): Promise<boolean>;

  /**
   * @description Destroys the backend */
  destroy(): Promise<void>;
}

/**
 * @description
 * The representation of a proof
 * */
export type ProofData = {
  /** @description Public inputs of a proof */
  publicInputs: string[];
  /** @description An byte array representing the proof */
  proof: Uint8Array;
};

/**
 * @description
 * The representation of a compiled circuit
 * */
export type CompiledCircuit = {
  /** @description The bytecode of the circuit */
  bytecode: string;
  /** @description ABI representation of the circuit */
  abi: Abi;
};
