function openTab(tabId) {
  const tabs = document.querySelectorAll('.tab-content');
  tabs.forEach(tab => tab.style.display = 'none');
  const selectedTab = document.getElementById(tabId);
  if (selectedTab) {
    selectedTab.style.display = 'block';
  }
}

document.addEventListener("DOMContentLoaded", function() {
  openTab('chin9c');
  loadTableData();
  addEventListenersToCells();
});

function saveTableData() {
  const tabData = {};
  document.querySelectorAll('.tab-content').forEach(tab => {
    const tabId = tab.id;
    tabData[tabId] = [];
    tab.querySelectorAll('table').forEach((table, tableIndex) => {
      const rowsData = [];
      table.querySelectorAll('tbody tr').forEach(row => {
        const rowData = Array.from(row.cells).map(cell => cell.innerText);
        rowsData.push(rowData);
      });
      const headers = Array.from(table.querySelectorAll('thead th')).map(cell => cell.innerText);
      tabData[tabId].push({
        header: headers,
        rows: rowsData
      });
    });
  });

  localStorage.setItem('tableData', JSON.stringify(tabData));
}

function loadTableData() {
  const tabData = JSON.parse(localStorage.getItem('tableData'));
  if (tabData) {
    document.querySelectorAll('.tab-content').forEach(tab => {
      const tabId = tab.id;
      const tables = tab.querySelectorAll('table');
      if (tabData[tabId]) {
        tabData[tabId].forEach((tableData, tableIndex) => {
          const table = tables[tableIndex];
          const headerRow = table.querySelector('thead tr');
          const bodyRows = table.querySelector('tbody');

          headerRow.innerHTML = ""; // Очистка заголовка перед восстановлением
          bodyRows.innerHTML = "";  // Очистка тела таблицы перед восстановлением

          tableData.header.forEach((headerText) => {
            const newHeaderCell = document.createElement('th');
            newHeaderCell.innerText = headerText;
            newHeaderCell.contentEditable = true;
            headerRow.appendChild(newHeaderCell);
          });

          tableData.rows.forEach((rowData) => {
            const row = document.createElement('tr');
            rowData.forEach((cellData) => {
              const cell = document.createElement('td');
              cell.innerText = cellData;
              cell.contentEditable = true;
              row.appendChild(cell);
            });
            bodyRows.appendChild(row);
          });
        });
      }
    });
  }
  addEventListenersToCells();
}

function addEventListenersToCells() {
  document.querySelectorAll('.tab-content table td, .tab-content table th').forEach(cell => {
    cell.contentEditable = true;
    cell.addEventListener('input', saveTableData);
  });
}

function addColumn(tableId) {
  const table = document.getElementById(tableId);
  if (table) {
    const headerRow = table.querySelector('thead tr');
    const bodyRows = table.querySelectorAll('tbody tr');
    const newColumnIndex = headerRow.cells.length;

    const newHeaderCell = document.createElement('th');
    newHeaderCell.innerText = 'nd';
    newHeaderCell.contentEditable = true;
    headerRow.appendChild(newHeaderCell);
    newHeaderCell.addEventListener('input', saveTableData);

    bodyRows.forEach(row => {
      const newCell = row.insertCell(newColumnIndex);
      newCell.contentEditable = true;
      newCell.innerText = '';
      newCell.addEventListener('input', saveTableData);
    });

    saveTableData();
  }
}

function addRow(tableId) {
  const table = document.getElementById(tableId);
  if (table) {
    const tbody = table.querySelector('tbody');
    const newRow = tbody.insertRow();
    const columnCount = Array.from(table.querySelector('thead tr').cells).length;

    for (let i = 0; i < columnCount; i++) {
      const newCell = newRow.insertCell(i);
      newCell.contentEditable = true;
      newCell.innerText = '';
      newCell.addEventListener('input', saveTableData);
    }

    saveTableData();
  }
}

function deleteRow(tableId) {
  const table = document.getElementById(tableId);
  const rowCount = table.querySelector('tbody').rows.length;

  if (rowCount > 0) {
    table.querySelector('tbody').deleteRow(rowCount - 1); // Удаляем последнюю строку в теле таблицы
    saveTableData();
  } else {
    alert("Нельзя удалить все строки!");
  }
}

function deleteColumn(tableId) {
  const table = document.getElementById(tableId);
  const columnCount = table.querySelector('thead tr').cells.length;

  if (columnCount > 1) {
    table.querySelectorAll('thead tr, tbody tr').forEach(row => {
      row.deleteCell(columnCount - 1); // Удаляем последний столбец
    });
    saveTableData();
  } else {
    alert("Нельзя удалить все столбцы!");
  }
}
