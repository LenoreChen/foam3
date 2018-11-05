package net.nanopay.security;

import java.security.NoSuchAlgorithmException;
import java.security.MessageDigest;
import java.util.ArrayList;

public class MerkleTree {
  protected static final int DEFAULT_SIZE = 50000;

  protected byte[][] data_ = null;
  protected int size_ = 0;
  protected String hashAlgorithm_ = null;

  private boolean paddedNodes_ = false;
  private boolean singleNode_ = false;
  private int treeDepth_ = 0;
  private ArrayList paddingLevels_ = new ArrayList();

  private ThreadLocal<MessageDigest> md_ = new ThreadLocal<MessageDigest>() {
    @Override
    protected MessageDigest initialValue() {
      try {
        return MessageDigest.getInstance(hashAlgorithm_);
      } catch (NoSuchAlgorithmException e) {
        throw new RuntimeException(e);
      }
    }

    @Override
    public MessageDigest get() {
      MessageDigest md = super.get();
      md.reset();
      return md;
    }
  };

  /**
   * Constructor for Merkle tree. Assumes that the default algorithm for the
   * hash is SHA-256.
   */
  public MerkleTree (){
    this("SHA-256");
  }

  /**
   * Constructor for the Merkle tree. Sets the algorithm for hashing to whatever
   * that is specified.
   *
   * @param hashAlgorithm Name of the hashing algorithm to be set for hashing.
   */
  public MerkleTree (String hashAlgorithm){
    hashAlgorithm_ = hashAlgorithm;
  }

  /**
   * This method appends a new hash to the list of hashes that need to be built
   * into a Merkle tree.
   *
   * @param newHash Hash value that is to be added to the Merkle tree.
   */
  public void addHash(byte[] newHash){
    if ( data_ == null ){
      data_ = new byte[DEFAULT_SIZE][newHash.length];
    } else if ( size_ == DEFAULT_SIZE ) {
      byte[][] oldData = data_;
      data_ = new byte[size_ + DEFAULT_SIZE][newHash.length];
      System.arraycopy(oldData, 0, data_, 0, size_);
    }

    data_[++size_] = newHash;
  }

  /**
   * This method builds the Merkle tree from the data that was already being
   * pushed to the object. Once the tree is built, the state of the object is
   * cleared.
   *
   * @return The new Merkle tree that was built.
   * @throws NoSuchAlgorithmException
   */
  public byte[][] buildTree() {
    if ( size_ == 0 ) {
      System.err.println("ERROR :: There is no data to build a HashTree.");
      return null;
    } else if ( size_ == 1 ) {
      /*
       * Since the top hash of one node is the same as its double hash, simply
       * add the node twice.
       */
      addHash(data_[0]);
      singleNode_ = true;
    }

    byte[][] tree;
    MessageDigest md = md_.get();
    int totalTreeNodes = computeTotalTreeNodes();
    tree = new byte[totalTreeNodes][data_[0].length];

    // copy nodes to the array
    for ( int i = paddedNodes_ ? totalTreeNodes - size_ - 1 : size_ - 1 ; i < totalTreeNodes; i++ ) {
      if ( paddedNodes_ && size_ % 2 != 0) {
        tree[i] = data_[(i - (totalTreeNodes - size_)) + 2];
      } else if ( paddedNodes_ && size_ % 2 == 0) {
        tree[i] = data_[(i - (totalTreeNodes - size_)) + 1];
      } else {
        tree[i] = data_[i - (totalTreeNodes - size_ - 1) ];
      }
    }

    // add the appropriate padding to the nodes
    addPadding(totalTreeNodes, tree);

    // at every null encountered that is an internal node increment the indices
    int nullIndex = 0;

    // build the tree
    for ( int k = paddedNodes_ ? totalTreeNodes - size_ - 2 : size_ - 2 ; k >= (0 - nullIndex / 2); k-- ){
      int index = k;
      int leftIndex;

      if ( paddedNodes_ && size_ % 2 == 0) {
        index++;
        leftIndex = 2 * index - 1 + nullIndex;
      } else {
        leftIndex = 2 * index + 1;
      }

      int rightIndex = leftIndex + 1;

      if ( leftIndex >= totalTreeNodes ){
        /* If the left branch of the node is outOfBounds; then this node is a
            fake node (used for balancing) */
        tree[index] = null;
      } else if ( rightIndex > totalTreeNodes ) {
        /* If the right branch of the node is out of bounds; then treat the left
            branch hash same as the right branch */
        md.update(tree[leftIndex]);
        md.update(tree[leftIndex]);
        tree[index] = md.digest();
      } else {
        // If both branches are within bounds

        if ( tree[index] == null ){
          nullIndex += 2;
          continue;
        } else if ( tree[leftIndex] == null ) {
          // If the left branch of the node is fake; then this node is also fake
          tree[index] = null;
        } else if ( tree[rightIndex] == null ) {
          /* If the right branch of the node is fake; then this node is the
              double hash of the left branch */
          md.update(tree[leftIndex]);
          md.update(tree[leftIndex]);
          tree[index] = md.digest();
        } else {
          // Default hash is the hash of the left and right branches
          md.update(tree[leftIndex]);
          md.update(tree[rightIndex]);
          tree[index] = md.digest();
        }
      }
    }

    // reset the state of the object prior to returning for the next tree.
    data_ = null;
    size_ = 0;

    return tree;
  }

  /**
   * This method computes the total number of nodes that the next level of the
   * tree should have. The tree must have an even number of nodes at every
   * level, even if one of the node is empty.
   *
   * @param n The current number of nodes expected at this level of the tree.
   * @return The correct number of nodes that should be expected at this level
   * of the tree.
   */
  protected int computeNextLevelNodes(int n){
    if (n % 2 == 0 || n == 1) {
      return n;
    } else {
      paddedNodes_ = true;
      paddingLevels_.add(treeDepth_);
      return n + 1;
    }
  }

  /**
   * This method returns the total number of nodes that will be required to
   * build the tree. This number includes the number of empty nodes that will
   * have to be created in order for the tree to be balanced at every level of
   * the tree.
   *
   * NOTE: The hash of size_ = 1 is never called and is hence never calculated
   * correctly here. Please see buildTree().
   *
   * @return Total number of nodes required to build the Merkle tree.
   */
  protected int computeTotalTreeNodes(){
    int n = size_;
    int nodeCount = 0;

    while ( n >= 1 ){
      nodeCount += computeNextLevelNodes(n);

      double check = n / 2.0;

      /**
       * This is only occur when n = 1; at this point, 1 (for the root) has
       * already been added to nodeCount. Hence, break.
       */
      if ( check <= 0.5 ) break;

      n = (int) Math.ceil(check);
      treeDepth_ += 1;
    }

    return nodeCount;
  }

  /**
   * This method pads the tree at the appropriate levels.
   *
   * @return voids
   */
  protected void addPadding(int totalTreeNodes, byte[][] tree){
    if ( singleNode_ ) {
      tree[totalTreeNodes - 1] = null;
      return;
    }

    for ( int l = 0 ; l < paddingLevels_.size() ; l++ ){
      int level = (int) paddingLevels_.get(l);

      if ( level == 0 ) {
        tree[totalTreeNodes - 1] = null;
        continue;
      }

      int adjustedLevel = treeDepth_ - level;

      double position = 0;
      for ( int e = 0; e <= adjustedLevel; e++ ) position += Math.pow(2, e);
      --position; //adjusting for 0 indexed array

      tree[(int) position] = null;
    }
  }
}
