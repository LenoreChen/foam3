# Receipt Generation

## Overview

A key requirement to the security design of the nanopay system is that the transaction ledger should be immutable. This can be addressed be using digital signatures to sign the contents of the ledger. A transaction is considered committed if and only if it is part of the signed ledger. In order to solve this issue, transactions are added to the ledger in batches, the state of the ledger is then signed, and that signature is then written out to the ledger. The signature that is written out to the ledger is considered the receipt that the transaction has been committed.#

## ReceiptGenerator

### Overview

ReceiptGenerator is an interface to be used in conjunction with the ReceiptGeneratingDAO. An implementation of the ReceiptGenerator must implement the following methods: add, build, and generate. The add method will add the FObject to the next block of receipts to be generated. The build method will take all of the FObject's in the receipt block and build a receipt for each one. The generate method will return a receipt object given an FObject. An FObject added to the ReceiptGenerator will be able to receive a receipt by calling generate after the build method has finished executing. The generate method should block until a receipt for a given object has been generated.

### Methods

<dl>
	<dt>add</dt>
	<dd>Adds an FObject to the receipt generator. An FObject added here will be able to have a receipt generated for it later.</dd>
	<dt>build</dt>
	<dd>Optional intermediate step that builds necessary models (i.e. a Merkle Tree) from which to generate receipts.</dd>
	<dt>generate</dt>
	<dd>Generates a receipt given an FObject.</dd>
</dl>

### Implementations

#### TimeBasedReceiptGenerator

##### Overview

TimeBasedReceiptGenerator is an implementation of ReceiptGenerator that generates receipts periodically given an interval (in ms).

##### Usage

```
import net.nanopay.security.receipt.ReceiptGenerator;
import net.nanopay.security.receipt.ReceiptGeneratingDAO;
import net.nanopay.security.receipt.TimeBasedReceiptGenerator;

foam.core.X x = foam.core.EmptyX.instance();
foam.core.ClassInfo of = foam.nanos.auth.User.getOwnClassInfo();
foam.dao.DAO delegate = new foam.dao.MDAO(of);

// set up receipt generator
ReceiptGenerator generator = new TimeBasedReceiptGenerator.Builder(x)
	.setHashingAlgorithm("SHA-256") 
	.setInterval(100) // 100 ms
	.setAlias("Test")
	.build();
```

## ReceiptGeneratingDAO

## Overview

The ReceiptGeneratingDAO creates receipts for every object that passes through the DAO. Every Receipt that is generated is stored in the receiptDAO.

## Usage

```
import net.nanopay.security.receipt.ReceiptGenerator;
import net.nanopay.security.receipt.ReceiptGeneratingDAO;
import net.nanopay.security.receipt.TimeBasedReceiptGenerator;

foam.core.X x = foam.core.EmptyX.instance();
foam.core.ClassInfo of = foam.nanos.auth.User.getOwnClassInfo();
foam.dao.DAO delegate = new foam.dao.MDAO(of);

// set up receipt generator
ReceiptGenerator generator = ...

// set up receipt generating dao
ReceiptGeneratingDAO dao = new ReceiptGeneratingDAO.Builder(x)
	.setGenerator(generator)
	.setDelegate(dao)
	.build();
```
