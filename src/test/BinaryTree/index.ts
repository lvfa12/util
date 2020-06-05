import { BinaryTree } from "@util/BinaryTree/index";

const tree = new BinaryTree();
let nodes = [50, 30, 80, 20, 35, 34, 32, 40, 70, 75, 100];
/**插入值节点 */
console.group('节点插入');
nodes.forEach(item => tree.insert(item));
console.log(tree);
console.groupEnd();

console.group('遍历')
console.log(tree.preOrderTraverse().map(item => item.key), "前序遍历");
console.log(tree.inOrderTraverse().map(item => item.key), "中序遍历");
console.log(tree.postOrderTraverse().map(item => item.key), "后序遍历");
console.groupEnd();

console.group('二叉查找')
console.log(tree.maxNode(), "最大节点");
console.log(tree.minNode(), "最小节点");
console.log(tree.search(75), "查询key为75的节点");
console.groupEnd();

console.group('删除了key为100的节点')
tree.removeNode(100);
console.log(JSON.stringify(tree.root, null, 4));
console.groupEnd();