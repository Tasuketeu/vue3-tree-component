import { describe, it, expect, beforeEach } from 'vitest';
import { TreeStore, TreeItem } from '@/stores/treestore/TreeStore';

const testItems: TreeItem[] = [
	{ id: 1, parent: null, label: 'Айтем 1' },
	{ id: '91064lcee', parent: 1, label: 'Айтем 2' },
	{ id: 3, parent: 1, label: 'Айтем 3' },
	{ id: 4, parent: '91064lcee', label: 'Айтем 4' },
	{ id: 5, parent: '91064lcee', label: 'Айтем 5' },
	{ id: 6, parent: '91064lcee', label: 'Айтем 6' },
	{ id: 7, parent: 4, label: 'Айтем 7' },
	{ id: 8, parent: 4, label: 'Айтем 8' },
];

describe('TreeStore', () => {
	let treeStore: TreeStore;

	beforeEach(() => {
		treeStore = new TreeStore([...testItems]);
	});

	it('getAll возвращает все элементы', () => {
		const all = treeStore.getAll();
		expect(all).toHaveLength(8);
		expect(all).toEqual(testItems);
	});

	it('getItem возвращает элемент по id', () => {
		const item = treeStore.getItem(1);
		expect(item).toEqual(testItems[0]);

		const stringIdItem = treeStore.getItem('91064lcee');
		expect(stringIdItem).toEqual(testItems[1]);
	});

	it('getChildren возвращает прямых детей', () => {
		const children = treeStore.getChildren(1);
		expect(children).toHaveLength(2);
		expect(children.map((c) => c.id)).toEqual(['91064lcee', 3]);
	});

	it('getAllChildren возвращает всех детей рекурсивно', () => {
		const allChildren = treeStore.getAllChildren(1);
		expect(allChildren).toHaveLength(6);
		expect(allChildren.map((c) => c.id)).toEqual([3, '91064lcee', 6, 5, 4, 8, 7]);
	});

	it('getAllParents возвращает цепочку родителей', () => {
		const parents = treeStore.getAllParents(7);
		expect(parents).toHaveLength(3);
		expect(parents.map((p) => p.id)).toEqual([4, '91064lcee', 1]);
	});

	it('addItem добавляет новый элемент', () => {
		const newItem: TreeItem = { id: 9, parent: 1, label: 'Айтем 9' };
		treeStore.addItem(newItem);

		expect(treeStore.getAll()).toHaveLength(9);
		expect(treeStore.getItem(9)).toEqual(newItem);
		expect(treeStore.getChildren(1)).toHaveLength(3);
	});

	it('removeItem удаляет элемент и его детей', () => {
		treeStore.removeItem(4);

		expect(treeStore.getItem(4)).toBeUndefined();
		expect(treeStore.getItem(7)).toBeUndefined();
		expect(treeStore.getItem(8)).toBeUndefined();
		expect(treeStore.getAll()).toHaveLength(5);
	});

	it('updateItem обновляет существующий элемент', () => {
		const updatedItem: TreeItem = { id: 1, parent: null, label: 'Обновленный Айтем 1' };
		treeStore.updateItem(updatedItem);

		expect(treeStore.getItem(1)?.label).toBe('Обновленный Айтем 1');
	});
});
