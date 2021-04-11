package net.nanopay.iso8583.test;

public class ISOLLBinaryTest
  extends AbstractISOBinaryFieldTest
{
  public ISOLLBinaryTest() {
    super(new net.nanopay.iso8583.type.ISOLLBinary(2, "Should be 1234"));
  }

  @Override
  public void runTest(foam.core.X x) {
    Test_ISOBinaryFieldTest_Pack(new byte[] { 0x12, 0x34 }, new byte[] { 0x30, 0x32, 0x12, 0x34 }, "[0x12, 0x34] is packed as [0x30, 0x32, 0x12, 0x34]");
    Test_ISOBinaryFieldTest_Unpack(new byte[] { 0x30, 0x32, 0x12, 0x34 }, new byte[] { 0x12, 0x34 }, "[0x30, 0x32, 0x12, 0x34] is unpacked as [0x12, 0x34]");
    Test_ISOBinaryFieldTest_Reversability(new byte[] { 0x12, 0x34 }, "Unpacked data equals original data");
  }
}