export type ItemId = number | string;

export interface TreeItem {
	id: ItemId;
	parent: string | number | null;
	label: string;
	[key: string]: unknown;
}

export interface UpdateItemData {
	id: ItemId;
	[key: string]: any;
}

// Для AG Grid
export interface GridContextMenuParams {
	node: {
		data: TreeItem;
	};
}

export class TreeStore {
	private items: Map<string | number, TreeItem>;
	private children: Map<string | number, TreeItem[]>;
	private paths: Map<string | number, (string | number)[]> = new Map();

	constructor(private initialItems: TreeItem[]) {
		this.items = new Map();
		this.children = new Map();
		this.buildTree();
		this.buildPaths();
	}

	private buildTree(): void {
		this.initialItems.forEach((item) => {
			this.items.set(item.id, item);
		});

		this.initialItems.forEach((item) => {
			if (item.parent !== null) {
				if (!this.children.has(item.parent)) {
					this.children.set(item.parent, []);
				}
				this.children.get(item.parent)!.push(item);
			}
		});
	}

	private buildPaths(): void {
		this.initialItems.forEach((item) => {
			this.paths.set(item.id, this.calculatePath(item.id));
		});
	}

	private calculatePath(id: string | number): (string | number)[] {
		const path: (string | number)[] = [];
		let currentId: string | number | null = id;

		while (currentId !== null) {
			const currentItem = this.items.get(currentId);
			if (currentItem) {
				path.unshift(currentItem.id);
				currentId = currentItem.parent;
			} else {
				break;
			}
		}

		return path;
	}

	getAll(): TreeItem[] {
		return [...this.initialItems];
	}

	getItem(id: string | number): TreeItem | undefined {
		return this.items.get(id);
	}

	getChildren(id: string | number): TreeItem[] {
		return this.children.get(id) || [];
	}

	getAllChildren(id: string | number): TreeItem[] {
		const result: TreeItem[] = [];
		const stack: TreeItem[] = [...this.getChildren(id)];

		while (stack.length > 0) {
			const current = stack.pop()!;
			result.push(current);
			stack.push(...this.getChildren(current.id));
		}

		return result;
	}

	getAllParents(id: string | number): TreeItem[] {
		const result: TreeItem[] = [];
		let current = this.getItem(id);

		while (current && current.parent !== null) {
			const parent = this.getItem(current.parent);
			if (parent) {
				result.push(parent);
				current = parent;
			} else {
				break;
			}
		}

		return result;
	}

	getPath(id: string | number): (string | number)[] {
		return this.paths.get(id) || [];
	}

	addItem(item: TreeItem): void {
		this.initialItems.push(item);
		this.items.set(item.id, item);

		if (item.parent !== null) {
			if (!this.children.has(item.parent)) {
				this.children.set(item.parent, []);
			}
			this.children.get(item.parent)!.push(item);
		}

		this.buildPaths();
	}

	removeItem(id: string | number): void {
		const allChildren = this.getAllChildren(id);
		allChildren.forEach((child) => {
			this.removeItemFromStorage(child.id);
		});

		this.removeItemFromStorage(id);
		this.buildPaths();
	}

	private removeItemFromStorage(id: string | number): void {
		const index = this.initialItems.findIndex((item) => item.id === id);
		if (index !== -1) {
			this.initialItems.splice(index, 1);
		}

		this.items.delete(id);
		this.paths.delete(id);

		this.children.delete(id);
		this.children.forEach((childrenList) => {
			const childIndex = childrenList.findIndex((child) => child.id === id);
			if (childIndex !== -1) {
				childrenList.splice(childIndex, 1);
			}
		});
	}

	updateItem(updatedItem: TreeItem): void {
		const existingItem = this.getItem(updatedItem.id);
		if (!existingItem) {
			this.addItem(updatedItem);
			return;
		}

		const index = this.initialItems.findIndex((item) => item.id === updatedItem.id);
		if (index !== -1) {
			this.initialItems[index] = updatedItem;
		}

		this.items.set(updatedItem.id, updatedItem);

		if (existingItem.parent !== updatedItem.parent) {
			if (existingItem.parent !== null) {
				const oldParentChildren = this.children.get(existingItem.parent);
				if (oldParentChildren) {
					const childIndex = oldParentChildren.findIndex(
						(child) => child.id === updatedItem.id
					);
					if (childIndex !== -1) {
						oldParentChildren.splice(childIndex, 1);
					}
				}
			}

			if (updatedItem.parent !== null) {
				if (!this.children.has(updatedItem.parent)) {
					this.children.set(updatedItem.parent, []);
				}
				this.children.get(updatedItem.parent)!.push(updatedItem);
			}
		}

		this.buildPaths();
	}
}
