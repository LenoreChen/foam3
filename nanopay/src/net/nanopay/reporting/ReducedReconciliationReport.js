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
  package: 'net.nanopay.reporting',
  name: 'ReducedReconciliationReport',

  mixins: [
    'foam.nanos.auth.CreatedAwareMixin',
  ],

  imports: [
    'currencyDAO'
  ],

  searchColumns: [
    'created',
    'completionDate'
  ],

  ids: [
    'paymentId'
  ],

  properties: [
    {
      name: 'clientName',
      class: 'String'
    },
    {
      name: 'paymentId',
      class: 'String'
    },
    {
      name: 'merchantId',
      class: 'String'
    },
    {
      name: 'paymentStartDate',
      class: 'DateTime'
    },
    {
      name: 'debitAmount',
      class: 'UnitValue',
      unitPropName: 'debitCurrency',
      view: { class: 'net.nanopay.liquidity.ui.LiquidCurrencyView' },
      unitPropValueToString: async function(x, val, unitPropName) {
        var unitProp = await x.currencyDAO.find(unitPropName);
        if ( unitProp )
          return unitProp.format(val);
        return val;
      },
      tableCellFormatter: function(value, obj) {
        obj.currencyDAO.find(obj.debitCurrency).then(function(c) {
          if ( c ) {
            this.add(c.format(value));
          } else {
            this.add(value);
          }
        }.bind(this));
      }
    },
    {
      name: 'debitCurrency',
      class: 'String'
    },
    {
      name: 'debitFileDate',
      class: 'DateTime'
    },
    {
      name: 'creditAmount',
      class: 'UnitValue',
      unitPropName: 'creditCurrency',
      view: { class: 'net.nanopay.liquidity.ui.LiquidCurrencyView' },
      unitPropValueToString: async function(x, val, unitPropName) {
        var unitProp = await x.currencyDAO.find(unitPropName);
        if ( unitProp )
          return unitProp.format(val);
        return val;
      },
      tableCellFormatter: function(value, obj) {
        obj.currencyDAO.find(obj.creditCurrency).then(function(c) {
          if ( c ) {
            this.add(c.format(value));
          } else {
            this.add(value);
          }
        }.bind(this));
      }
    },
    {
      name: 'creditCurrency',
      class: 'String'
    },
    {
      name: 'creditFileDate',
      class: 'DateTime'
    },
    {
      name: 'paymentStatusCategory',
      class: 'String'
    },
    {
      name: 'paymentStatus',
      class: 'foam.core.Enum',
      of: 'net.nanopay.tx.model.TransactionStatus',
    },
    {
      name: 'feeRevenueCurrency',
      class: 'String'
    },
    {
      name: 'nanopayRevenue',
      class: 'UnitValue',
      unitPropName: 'feeRevenueCurrency',
      view: { class: 'net.nanopay.liquidity.ui.LiquidCurrencyView' },
      unitPropValueToString: async function(x, val, unitPropName) {
        var unitProp = await x.currencyDAO.find(unitPropName);
        if ( unitProp )
          return unitProp.format(val);
        return val;
      },
      tableCellFormatter: function(value, obj) {
        obj.currencyDAO.find(obj.feeRevenueCurrency).then(function(c) {
          if ( c ) {
            this.add(c.format(value));
          } else {
            this.add(value);
          }
        }.bind(this));
      }
    },
    {
      name: 'vendorRevenue',
      class: 'UnitValue',
      unitPropName: 'feeRevenueCurrency',
      view: { class: 'net.nanopay.liquidity.ui.LiquidCurrencyView' },
      unitPropValueToString: async function(x, val, unitPropName) {
        var unitProp = await x.currencyDAO.find(unitPropName);
        if ( unitProp )
          return unitProp.format(val);
        return val;
      },
      tableCellFormatter: function(value, obj) {
        obj.currencyDAO.find(obj.feeRevenueCurrency).then(function(c) {
          if ( c ) {
            this.add(c.format(value));
          } else {
            this.add(value);
          }
        }.bind(this));
      }
    }
  ]
})