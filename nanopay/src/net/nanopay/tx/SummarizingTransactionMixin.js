/**
 * NANOPAY CONFIDENTIAL
 *
 * [2020] nanopay Corporation
 * All Rights Reserved.
 *
 * NOTICE:  All information contained herein is, and remains
 * the property of nanopay Corporation.
 * The intellectual and technical concepts contained
 * herein are proprietary to nanopay Corporation
 * and may be covered by Canadian and Foreign Patents, patents
 * in process, and are protected by trade secret or copyright law.
 * Dissemination of this information or reproduction of this material
 * is strictly forbidden unless prior written permission is obtained
 * from nanopay Corporation.
 */

foam.CLASS({
  package: 'net.nanopay.tx',
  name: 'SummarizingTransactionMixin',

  documentation: 'default implementation for SummarizingTransactionInterface',

  javaImports: [
    'foam.dao.DAO',
    'foam.dao.ArraySink',
    'foam.util.SafetyUtil',
    'java.util.List',
    'net.nanopay.integration.ErrorCode',
    'net.nanopay.tx.model.Transaction',
    'net.nanopay.tx.model.TransactionStatus',
    'net.nanopay.tx.cico.CITransaction',
    'net.nanopay.tx.cico.COTransaction',
    'net.nanopay.tx.ChainSummary',
    'net.nanopay.tx.DigitalTransaction',
    'net.nanopay.tx.PartnerTransaction',
    'net.nanopay.tx.ValueMovementTransaction',
    'static foam.mlang.MLang.EQ'
  ],

  implements: [
    'net.nanopay.tx.SummarizingTransaction'
  ],

  methods: [
    {
      documentation: 'sorts transaction into category, for display to user.',
      name: 'categorize_',
      args: [
        { name: 't', type: 'net.nanopay.tx.model.Transaction' }
      ],
      type: 'String',
      javaCode: `
        if (t.getStatus().equals(TransactionStatus.COMPLETED))
          return "";
        if (t instanceof CITransaction)
          return "CashIn";
        if (t instanceof COTransaction)
          return "CashOut";
        if (t instanceof PartnerTransaction)
          return "Partner";
        if (t instanceof DigitalTransaction)
          return "Digital";
        else
          return "Approval";
      `
    },
    {
      documentation: `Collect all line items of succeeding transactions of self.`,
      name: 'collectLineItems',
      javaCode: `
      collectLineItemsFromChain(getNext());
      `
    },
    {
      documentation: `Collect all line items of succeeding transactions of transactions.`,
      name: 'collectLineItemsFromChain',
      args: [
        {
          name: 'transactions',
          type: 'net.nanopay.tx.model.Transaction[]'
        }
      ],
      javaCode: `
      if ( transactions != null ) {
        for ( Transaction transaction : transactions ) {
          addLineItems(transaction.getLineItems());
          collectLineItemsFromChain(transaction.getNext());
        }
      }
      `
    },
    {
      name: 'getChainSummary',
      type: 'net.nanopay.tx.ChainSummary'
    },
    {
      documentation: 'Updates transients on current transaction, returns true if anything was modified.',
      name: 'calculateTransients',
      args: [
        { name: 'x', type: 'Context' },
        { name: 'txn', type: 'net.nanopay.tx.model.Transaction' }
      ],
      javaCode: `
        DAO dao = (DAO) x.get("localTransactionDAO");
        DAO stDAO = (DAO) x.get("summaryTransactionDAO");
        List children = ((ArraySink) dao.where(EQ(Transaction.PARENT, txn.getId())).select(new ArraySink())).getArray();

        for ( Object obj : children ) {
          Transaction child = (Transaction) obj;
          this.calculateTransients(x, child);

          if ( ( ! depositAmountIsSet_ ) && ( child instanceof ValueMovementTransaction ) && SafetyUtil.equals(this.getDestinationAccount(), child.getDestinationAccount()) ) {
            var amount = getDepositAmount();
            var namount = child.getTotal(x, child.getDestinationAccount());
            if ( amount != namount )
              this.setDepositAmount(namount);
          }
          if ( ( ! withdrawalAmountIsSet_ ) && ( child instanceof ValueMovementTransaction) && SafetyUtil.equals(this.getSourceAccount(), child.getSourceAccount()) ) {
            var amount = getWithdrawalAmount();
            var namount = -child.getTotal(x, child.getSourceAccount());
            if ( amount != namount )
              this.setWithdrawalAmount(namount);
          }
        }

        if (SafetyUtil.equals(txn, this)) {
          Transaction t = this.getStateTxn(x);
          ChainSummary cs = new ChainSummary();
          if (t.getStatus() != TransactionStatus.COMPLETED) {
            cs.setErrorCode(t.getErrorCode());
            ErrorCode errorCode = cs.findErrorCode(x);
            if ( errorCode != null ) {
              cs.setErrorInfo(errorCode.getSummary());
            }
          }
          cs.setStatus(t.getStatus());
          cs.setCategory(categorize_(t));
          cs.setSummary(cs.toSummary());
          if ( cs.compareTo(getChainSummary()) != 0 )
            this.setChainSummary(cs);
        }
      `
    }
  ]
});