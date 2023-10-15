import type { BlockchainApiIdentityRequest, BlockchainApiIdentityResponse } from '../utils/TypeUtil.js';
export declare const BlockchainApiController: {
    fetchIdentity({ caipChainId, address }: BlockchainApiIdentityRequest): Promise<BlockchainApiIdentityResponse>;
};
