
class BinaryTreeNode {
  public left: BinaryTreeNode = null;
  public right: BinaryTreeNode = null;
  public value: any = null;
  public key: number = null;
  constructor(key: number) {
    this.key = key;
  }
  /** 克隆一个节点 */
  /** 只克隆节点本身，不克隆子节点 */
  static clone(node: BinaryTreeNode) {
    if (node === void 0) throw new Error('clone 方法需要传入一个 BinaryTreeNode对象');
    const newNode = new BinaryTreeNode(node.key);
    newNode.left = node.left;
    newNode.right = node.right;
    newNode.value = node.value;
    return newNode;
  }
}

/** 二叉树 */
export class BinaryTree {
  public root: BinaryTreeNode = null;
  /** 插入节点 */
  insert(key: number, insertNode: BinaryTreeNode = this.root, binaryNode?: BinaryTreeNode) {
    const node = binaryNode || new BinaryTreeNode(key);
    if (this.root === null) return this.root = node;
    let root = insertNode;
    while (true) {
      if (key < root.key) {
        if (root.left === null) {
          root.left = node;
          break;
        }
        root = root.left;
      } else {
        if (root.right === null) {
          root.right = node;
          break;
        }
        root = root.right;
      }
    }
  }

  /**
   * 中序遍历
   */
  public inOrderTraverse() {
    const stack: Array<BinaryTreeNode> = [this.root];
    const result: Array<BinaryTreeNode> = [];
    let nowNode: BinaryTreeNode = this.root;
    let nowNodeBranch = 'left';
    while (true) {
      if (nowNodeBranch === "left") {
        if (nowNode.left !== null) {
          stack.push(nowNode.left);
          nowNode = nowNode.left;
        } else {
          result.push(nowNode);
          nowNode = stack.pop();
          nowNodeBranch = "right";
        }
      } else {
        if (nowNode.right !== null) {
          nowNodeBranch = 'left';
          stack.push(nowNode.right);
          nowNode = nowNode.right;
        } else {
          if (stack.length === 0) break;
          nowNode = stack.pop();
          result.push(nowNode);
        }
      }
    }
    return result;
  }

  // 前序遍历
  public preOrderTraverse() {
    const stack: Array<BinaryTreeNode> = [this.root];
    const result: Array<BinaryTreeNode> = [];
    let nowNode: BinaryTreeNode = this.root;
    let nowNodeBranch = 'left';
    while (true) {
      if (nowNodeBranch === "left") {
        if (nowNode.left !== null) {
          stack.push(nowNode.left);
          result.push(nowNode);
          nowNode = nowNode.left;
        } else {
          result.push(nowNode);
          nowNode = stack.pop();
          nowNodeBranch = "right";
        }
      } else {
        if (nowNode.right !== null) {
          nowNodeBranch = 'left';
          stack.push(nowNode.right);
          nowNode = nowNode.right;
        } else {
          if (stack.length === 0) break;
          nowNode = stack.pop();
        }
      }
    }
    return result;
  }


  /**后续遍历 */
  public postOrderTraverse() {
    const stack: Array<BinaryTreeNode> = [this.root];
    const result: Array<BinaryTreeNode> = [];
    let nowNode: BinaryTreeNode = this.root;
    let nowNodeBranch = 'left';
    while (true) {
      if (stack.length === 0) break;
      if (nowNodeBranch === "left") {
        if (nowNode.left !== null) {
          stack.push(nowNode.left);
          nowNode = nowNode.left;
        } else {
          nowNodeBranch = "right";
        }
      } else {
        if (nowNode.right !== null) {
          if (result[result.length - 1].key > nowNode.key) {
            result.push(stack.pop());
            nowNode = stack[stack.length - 1];
            continue;
          }
          nowNodeBranch = "left";
          stack.push(nowNode.right);
          nowNode = nowNode.right;
        } else {
          result.push(stack.pop());
          nowNode = stack[stack.length - 1];
        }
      }
    }
    return result;
  }
  /**
   * 获取key值最小的节点
   * @param node （可选）要获取最小值的节点
   */
  public minNode(node: BinaryTreeNode = this.root) {
    let nowNode = node;
    if (nowNode === null) return nowNode;
    while (nowNode.left !== null) {
      nowNode = nowNode.left;
    }
    return nowNode;
  }
  // 获取key值最大的节点
  public maxNode() {
    let node = this.root;
    if (node === null) return node;
    while (node.right !== null) {
      node = node.right;
    }
    return node;
  }
  // 查询
  public search(key: number) {
    if (this.root === null) return null;
    let node = this.root;
    while (true) {
      if (node === null) return null;
      if (node.key === key) break;
      node = key < node.key ? node.left : node.right;
    }
    return node;
  }

  /**
   * 删除节点
   * @param key 删除节点的key值
   * @returrn boolean 是否删除成功
   */
  public removeNode(key: number): boolean {
    if (this.root === null) return null;
    if (this.root.key === key) { // 判断是不是根节点
      this.root = this._removeNode(this.root);
      return true;
    }
    let nowNode: BinaryTreeNode = this.root;
    while (true) {
      const direction = nowNode.key > key ? "left" : "right";
      if (nowNode[direction] === null) return false; // 走到这里代表查找节点失败
      if (nowNode[direction].key === key) {
        nowNode[direction] = this._removeNode(nowNode[direction]);
        return true;
      } else {
        nowNode = nowNode[direction];
      }
    }
  }

  private _removeNode(node: BinaryTreeNode): BinaryTreeNode {
    // 如果左右节点都为null 则表明是叶子节点，直接返回null
    if (node.left === null && node.right === null) return null;
    // 左右节点都不为null
    if (node.left !== null && node.right !== null) {
      let nowNode = node.right;
      let preNode = node;
      let newNode = null;
      let direction: "left" | "right" = "right";
      while (true) {
        if (nowNode.left === null) {
          newNode = nowNode;
          preNode[direction] = this._removeNode(preNode[direction]);
          newNode.left = node.left;
          newNode.right = node.right;
          return newNode;
        } else {
          direction = "left";
          preNode = nowNode;
          nowNode = nowNode.left;
        }
      }

    }
    // 左节点不为null，但右节点为null
    if (node.left !== null) return node.left;
    // 左节点为null, 右节点为null
    return node.right;
  }
  
}

