use crate::transaction::context::TxContext;
use crate::header::Header;

struct CombinedConstantData {
    historical_header: Header,
    // Note: `chainId` and `version` in txContext are not redundant to the values in
    // self.historical_header.global_variables because they can be different in case of a protocol upgrade. In such
    // a situation we could be using header from a block before the upgrade took place but be using the updated
    // protocol to execute and prove the transaction.
    tx_context: TxContext,
}
