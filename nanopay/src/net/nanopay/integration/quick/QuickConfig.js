foam.CLASS({
  package: 'net.nanopay.integration.quick',
  name: 'QuickConfig',
  documentation: 'Abstract Model for Xero Config',
  properties: [
    {
      class: 'String',
      name: 'clientId',
      value: 'L0BGm27rIJOzAILPCmvlC9BnTXlWJIAAxxJE13rR877sae0Al3'
    },
    {
      class: 'String',
      name: 'clientSecret',
      value: 'REa9ITUEDxJRNhz0WfT6atNlMMZKWxUj1iScqCsk'
    },
    {
      class: 'String',
      name: 'appRedirect',
      value: 'http://localhost:8080/service/quick'
    },
    {
      class: 'String',
      name: 'intuitAccountingAPIHost',
      value: 'https://sandbox-quickbooks.api.intuit.com'
    }
  ]
});
