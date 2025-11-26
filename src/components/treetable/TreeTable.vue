<template>
  <div class="tree-table-container">
    <AgGridVue
        class="ag-theme-alpine"
        style="height: 100%"
        :columnDefs="columnDefs"
        :rowData="rowData"
        :treeData="true"
        :getDataPath="getDataPath"
        :groupDefaultExpanded="1"
        :autoGroupColumnDef="autoGroupColumnDef"
        :theme="'legacy'"
        :rowHeight="42"
        :headerHeight="48"
        :animateRows="true"
        :gridOptions="gridOptions"
        @grid-ready="onGridReady"
        @row-group-opened="onRowGroupOpened"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { AgGridVue } from 'ag-grid-vue3';
import type { AutoGroupColumnDef, ColDef, GridApi, GridReadyEvent } from 'ag-grid-community';

import { TreeItem, TreeStore } from '@/stores/treestore/TreeStore';

interface Props {
  items: TreeItem[];
}

const props = defineProps<Props>();

const gridApi = ref<GridApi | null>(null);

const treeStore = ref<TreeStore>(new TreeStore(props.items));

const rowData = computed(() => {
  return treeStore.value.getAll();
});

const getDataPath = (data: TreeItem): (string | number)[] => {
  return treeStore.value.getPath(data.id);
};

const getCategory = (params: any): string => {
  const item = params.data;
  const children = treeStore.value.getChildren(item.id);
  return children.length > 0 ? 'Группа' : 'Элемент';
};

const getParentName = (params: any): string => {
  const item = params.data;
  if (item.parent === null) {
    return 'Корень';
  }
  const parent = treeStore.value.getItem(item.parent);
  return parent?.label || `ID: ${item.parent}`;
};

const columnDefs = ref<ColDef[]>([
  {
    headerName: '№ п/п',
    field: 'sequentialNumber',
    valueGetter: 'node.rowIndex + 1',
    width: 110,
    pinned: 'left',
  },
  {
    headerName: 'Категория',
    valueGetter: getCategory,
    width: 700,
  },
  {
    headerName: 'Родитель',
    valueGetter: getParentName,
    width: 700,
    hide: true,
  },
]);

const gridOptions = {
  getContextMenuItems: (params) => {
    const menuItems = [];
    if (params.node) {
      menuItems.push({
        name: 'Удалить строку',
        action: () => {
          this.gridApi.applyTransaction({ remove: [params.node.data] });
        }
      });
    }
    menuItems.push({
      name: 'Вставить строку выше',
      action: () => {
        const newItem = { id: Date.now(), label: 'Новая строка' };
        this.gridApi.applyTransaction({
          add: [newItem],
          addIndex: params.node.rowIndex
        });
      }
    });
    return menuItems;
  }
};

const autoGroupColumnDef = ref<AutoGroupColumnDef>({
  headerName: 'Наименование',
  field: 'label',
  flex: 1,
  cellRendererParams: {
    suppressCount: true,
  },
});

const refreshSequentialNumbers = () => {
  if (gridApi.value) {
    gridApi.value.refreshCells({
      columns: ['sequentialNumber'],
      force: true
    });
  }
};

const onRowGroupOpened = (event: any) => {
  setTimeout(() => {
    refreshSequentialNumbers();
  }, 10);
};

const onGridReady = (params: GridReadyEvent) => {
  gridApi.value = params.api;
};
</script>

<style scoped>
.tree-table-container {
  height: 600px;
  width: 100%;
}
</style>

<style>
html,
body {
  height: 100%;
  margin: 0;
  padding: 0;
}

#app {
  height: 100%;
}
</style>
