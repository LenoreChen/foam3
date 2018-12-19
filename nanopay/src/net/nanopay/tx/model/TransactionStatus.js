foam.ENUM({
  package: 'net.nanopay.tx.model',
  name: 'TransactionStatus',

  documentation: 'Status for CICO transactions',

  values: [
    {
      name: 'PENDING',
      label: 'Pending'
    },
    {
      name: 'REVERSE',
      label: 'Reverse'
    },
    {
      name: 'REVERSE_FAIL',
      label: 'ReverseFail'
    },
    {
      name: 'SENT',
      label: 'Sent'
    },
    {
      name: 'DECLINED',
      label: 'Declined'
    },
    {
      name: 'COMPLETED',
      label: 'Completed'
    },
    {
      name: 'REFUNDED',
      label: 'Refunded'
    },
    {
      name: 'ACSP',
      label: 'ACSP'
    },
    {
      name: 'ACSC',
      label: 'ACSC'
    },
    {
      name: 'FAILED',
      label: 'Failed'
    },
    {
      name: 'PAUSED',
      label: 'Paused'
    },
    {
      name: 'CANCELLED',
      label: 'Cancelled'
    },
    {
      name: 'PENDING_PARENT_COMPLETED',
      label: 'Pending Parent Completed'
    },
  ]
});
