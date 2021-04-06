package net.nanopay.iso8583.packager;

import net.nanopay.iso8583.AbstractISOPackager;
import net.nanopay.iso8583.ISOFieldPackager;
import net.nanopay.iso8583.type.*;

/**
 * ISO 8583:1993 packager
 */
public class ISO93Packager
  extends AbstractISOPackager
{
  public ISO93Packager() {
    super(new ISOFieldPackager[] {
      /* 000 */ new ISONumeric    (   4, "Message Type Indicator"),
      /* 001 */ new ISOBitMap     (  16, "Bitmap"),
      /* 002 */ new ISOLLNumeric  (  19, "Primary Account number"),
      /* 003 */ new ISONumeric    (   6, "Processing Code"),
      /* 004 */ new ISONumeric    (  12, "Amount, Transaction"),
      /* 005 */ new ISONumeric    (  12, "Amount, Reconciliation"),
      /* 006 */ new ISONumeric    (  12, "Amount, Cardholder billing"),
      /* 007 */ new ISONumeric    (  10, "Date and time, transmission"),
      /* 008 */ new ISONumeric    (   8, "Amount, Cardholder billing fee"),
      /* 009 */ new ISONumeric    (   8, "Conversion rate, Reconciliation"),
      /* 010 */ new ISONumeric    (   8, "Conversion rate, Cardholder billing"),
      /* 011 */ new ISONumeric    (   6, "Systems trace audit number"),
      /* 012 */ new ISONumeric    (  12, "Date and time, Local transaction"),
      /* 013 */ new ISONumeric    (   4, "Date, Effective"),
      /* 014 */ new ISONumeric    (   4, "Date, Expiration"),
      /* 015 */ new ISONumeric    (   6, "Date, Settlement"),
      /* 016 */ new ISONumeric    (   4, "Date, Conversion"),
      /* 017 */ new ISONumeric    (   4, "Date, Capture"),
      /* 018 */ new ISONumeric    (   4, "Merchant type"),
      /* 019 */ new ISONumeric    (   3, "Country code, Acquiring institution"),
      /* 020 */ new ISONumeric    (   3, "Country code, Primary account number"),
      /* 021 */ new ISONumeric    (   3, "Country code, Forwarding institution"),
      /* 022 */ new ISOChar       (  12, "Point of service data code"),
      /* 023 */ new ISONumeric    (   3, "Card sequence number"),
      /* 024 */ new ISONumeric    (   3, "Function code"),
      /* 025 */ new ISONumeric    (   4, "Message reason code"),
      /* 026 */ new ISONumeric    (   4, "Card acceptor business code"),
      /* 027 */ new ISONumeric    (   1, "Approval code length"),
      /* 028 */ new ISONumeric    (   6, "Date, Reconciliation"),
      /* 029 */ new ISONumeric    (   3, "Reconciliation indicator"),
      /* 030 */ new ISONumeric    (  24, "Amounts, original"),
      /* 031 */ new ISOLLChar     (  99, "Acquirer reference data"),
      /* 032 */ new ISOLLNumeric  (  11, "Acquirer institution identification code"),
      /* 033 */ new ISOLLNumeric  (  11, "Forwarding institution identification code"),
      /* 034 */ new ISOLLChar     (  28, "Primary account number, extended"),
      /* 035 */ new ISOLLChar     (  37, "Track 2 data"),
      /* 036 */ new ISOLLLChar    ( 104, "Track 3 data"),
      /* 037 */ new ISOChar       (  12, "Retrieval reference number"),
      /* 038 */ new ISOChar       (   6, "Approval code"),
      /* 039 */ new ISONumeric    (   3, "Action code"),
      /* 040 */ new ISONumeric    (   3, "Service code"),
      /* 041 */ new ISOChar       (   8, "Card acceptor terminal identification"),
      /* 042 */ new ISOChar       (  15, "Card acceptor identification code"),
      /* 043 */ new ISOLLChar     (  99, "Card acceptor name/location"),
      /* 044 */ new ISOLLChar     (  99, "Additional response data"),
      /* 045 */ new ISOLLChar     (  76, "Track 1 data"),
      /* 046 */ new ISOLLLChar    ( 204, "Amounts, Fees"),
      /* 047 */ new ISOLLLChar    ( 999, "Additional data - national"),
      /* 048 */ new ISOLLLChar    ( 999, "Additional data - private"),
      /* 049 */ new ISOChar       (   3, "Currency code, Transaction"),
      /* 050 */ new ISOChar       (   3, "Currency code, Reconciliation"),
      /* 051 */ new ISOChar       (   3, "Currency code, Cardholder billing"),
      /* 052 */ new ISOBinary     (   8, "Personal identification number (PIN) data"),
      /* 053 */ new ISOLLBinary   (  48, "Security related control information"),
      /* 054 */ new ISOLLLChar    ( 120, "Amounts, additional"),
      /* 055 */ new ISOLLLBinary  ( 255, "IC card system related data"),
      /* 056 */ new ISOLLNumeric  (  35, "Original data elements"),
      /* 057 */ new ISONumeric    (   3, "Authorization life cycle code"),
      /* 058 */ new ISOLLNumeric  (  11, "Authorizing agent institution Id Code"),
      /* 059 */ new ISOLLLChar    ( 999, "Transport data"),
      /* 060 */ new ISOLLLChar    ( 999, "Reserved for national use"),
      /* 061 */ new ISOLLLChar    ( 999, "Reserved for national use"),
      /* 062 */ new ISOLLLChar    ( 999, "Reserved for private use"),
      /* 063 */ new ISOLLLChar    ( 999, "Reserved for private use"),
      /* 064 */ new ISOBinary     (   8, "Message authentication code field"),
      /* 065 */ new ISOBinary     (   8, "Reserved for ISO use"),
      /* 066 */ new ISOLLLChar    ( 204, "Amounts, original fees"),
      /* 067 */ new ISONumeric    (   2, "Extended payment data"),
      /* 068 */ new ISONumeric    (   3, "Country code, receiving institution"),
      /* 069 */ new ISONumeric    (   3, "Country code, settlement institution"),
      /* 070 */ new ISONumeric    (   3, "Country code, authorizing agent Inst."),
      /* 071 */ new ISONumeric    (   8, "Message number"),
      /* 072 */ new ISOLLLChar    ( 999, "Data record"),
      /* 073 */ new ISONumeric    (   6, "Date, action"),
      /* 074 */ new ISONumeric    (  10, "Credits, number"),
      /* 075 */ new ISONumeric    (  10, "Credits, reversal number"),
      /* 076 */ new ISONumeric    (  10, "Debits, number"),
      /* 077 */ new ISONumeric    (  10, "Debits, reversal number"),
      /* 078 */ new ISONumeric    (  10, "Transfer, number"),
      /* 079 */ new ISONumeric    (  10, "Transfer, reversal number"),
      /* 080 */ new ISONumeric    (  10, "Inquiries, number"),
      /* 081 */ new ISONumeric    (  10, "Authorizations, number"),
      /* 082 */ new ISONumeric    (  10, "Inquiries, reversal number"),
      /* 083 */ new ISONumeric    (  10, "Payments, number"),
      /* 084 */ new ISONumeric    (  10, "Payments, reversal number"),
      /* 085 */ new ISONumeric    (  10, "Fee collections, number"),
      /* 086 */ new ISONumeric    (  16, "Credits, amount"),
      /* 087 */ new ISONumeric    (  16, "Credits, reversal amount"),
      /* 088 */ new ISONumeric    (  16, "Debits, amount"),
      /* 089 */ new ISONumeric    (  16, "Debits, reversal amount"),
      /* 090 */ new ISONumeric    (  10, "Authorizations, reversal number"),
      /* 091 */ new ISONumeric    (   3, "Country code, transaction Dest. Inst."),
      /* 092 */ new ISONumeric    (   3, "Country code, transaction Orig. Inst."),
      /* 093 */ new ISOLLNumeric  (  11, "Transaction Dest. Inst. Id code"),
      /* 094 */ new ISOLLNumeric  (  11, "Transaction Orig. Inst. Id code"),
      /* 095 */ new ISOLLChar     (  99, "Card issuer reference data"),
      /* 096 */ new ISOLLLBinary  ( 999, "Key management data"),
      /* 097 */ new ISOAmount     (1+16, "Amount, Net reconciliation"),
      /* 098 */ new ISOChar       (  25, "Payee"),
      /* 099 */ new ISOLLChar     (  11, "Settlement institution Id code"),
      /* 100 */ new ISOLLNumeric  (  11, "Receiving institution Id code"),
      /* 101 */ new ISOLLChar     (  17, "File name"),
      /* 102 */ new ISOLLChar     (  28, "Account identification 1"),
      /* 103 */ new ISOLLChar     (  28, "Account identification 2"),
      /* 104 */ new ISOLLLChar    ( 100, "Transaction description"),
      /* 105 */ new ISONumeric    (  16, "Credits, Chargeback amount"),
      /* 106 */ new ISONumeric    (  16, "Debits, Chargeback amount"),
      /* 107 */ new ISONumeric    (  10, "Credits, Chargeback number"),
      /* 108 */ new ISONumeric    (  10, "Debits, Chargeback number"),
      /* 109 */ new ISOLLChar     (  84, "Credits, Fee amounts"),
      /* 110 */ new ISOLLChar     (  84, "Debits, Fee amounts"),
      /* 111 */ new ISOLLLChar    ( 999, "Reserved for ISO use"),
      /* 112 */ new ISOLLLChar    ( 999, "Reserved for ISO use"),
      /* 113 */ new ISOLLLChar    ( 999, "Reserved for ISO use"),
      /* 114 */ new ISOLLLChar    ( 999, "Reserved for ISO use"),
      /* 115 */ new ISOLLLChar    ( 999, "Reserved for ISO use"),
      /* 116 */ new ISOLLLChar    ( 999, "Reserved for national use"),
      /* 117 */ new ISOLLLChar    ( 999, "Reserved for national use"),
      /* 118 */ new ISOLLLChar    ( 999, "Reserved for national use"),
      /* 119 */ new ISOLLLChar    ( 999, "Reserved for national use"),
      /* 120 */ new ISOLLLChar    ( 999, "Reserved for national use"),
      /* 121 */ new ISOLLLChar    ( 999, "Reserved for national use"),
      /* 122 */ new ISOLLLChar    ( 999, "Reserved for national use"),
      /* 123 */ new ISOLLLChar    ( 999, "Reserved for private use"),
      /* 124 */ new ISOLLLChar    ( 999, "Reserved for private use"),
      /* 125 */ new ISOLLLChar    ( 999, "Reserved for private use"),
      /* 126 */ new ISOLLLChar    ( 999, "Reserved for private use"),
      /* 127 */ new ISOLLLChar    ( 999, "Reserved for private use"),
      /* 128 */ new ISOBinary     (   8, "Message authentication code field")
    });
  }
}