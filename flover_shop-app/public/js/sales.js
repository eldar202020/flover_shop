/**
 * sales.js — логика страницы управления продажами
 * Двухуровневая защита от превышения остатка:
 *  1. Клиент: мгновенная подсветка строки при вводе кол-ва
 *  2. Сервер: транзакционная проверка + декремент (409 если мало)
 */

(function () {
  'use strict';

  // ── Состояние ────────────────────────────────────────────────
  let currentDiscount = 0;
  let rowCount = 0;

  // Оперативный склад: id → quantity. Обновляем при добавлении строк.
  const stock = {};
  PRODUCTS_DATA.forEach(p => { stock[p.id] = p.quantity; });

  // ── DOM ──────────────────────────────────────────────────────
  const selectCustomer  = document.getElementById('selectCustomer');
  const selectPriceList = document.getElementById('selectPriceList');
  const discountAlert   = document.getElementById('discountAlert');
  const discountText    = document.getElementById('discountText');
  const btnAddRow       = document.getElementById('btnAddRow');
  const itemsContainer  = document.getElementById('saleItemsContainer');
  const emptyMsg        = document.getElementById('emptyItemsMsg');
  const btnSubmit       = document.getElementById('btnSubmitSale');

  const subtotalDisplay       = document.getElementById('subtotalDisplay');
  const discountAmountDisplay = document.getElementById('discountAmountDisplay');
  const totalDisplay          = document.getElementById('totalDisplay');

  // Модал ошибки остатка
  const stockErrorModal     = new bootstrap.Modal(document.getElementById('stockErrorModal'));
  const stockErrorMsg       = document.getElementById('stockErrorMsg');
  const stockErrorRequested = document.getElementById('stockErrorRequested');
  const stockErrorAvailable = document.getElementById('stockErrorAvailable');

  // ── Система лояльности ───────────────────────────────────────
  selectCustomer.addEventListener('change', async function () {
    const opt = this.options[this.selectedIndex];
    if (!opt.value) { applyDiscount(0); return; }

    let purchases = parseInt(opt.dataset.purchases || '0', 10);

    try {
      const r = await fetch('/api/sale');
      if (r.ok) {
        const all = await r.json();
        purchases = all.filter(s => s.id_customer === parseInt(opt.value, 10)).length;
      }
    } catch (_) {}

    applyDiscount(purchases > 10 ? 10 : purchases > 5 ? 5 : 0, purchases);
  });

  function applyDiscount(pct, purchases = 0) {
    currentDiscount = pct;
    if (pct > 0) {
      discountAlert.classList.remove('d-none');
      discountText.textContent = `Скидка постоянного клиента ${pct}% (покупок: ${purchases})`;
    } else {
      discountAlert.classList.add('d-none');
    }
    recalculate();
  }

  // ── Добавление строки товара ──────────────────────────────────
  btnAddRow.addEventListener('click', addProductRow);

  function addProductRow() {
    emptyMsg.classList.add('d-none');
    rowCount++;
    const rid = `row_${rowCount}`;

    const opts = PRODUCTS_DATA.map(p =>
      `<option value="${p.id}" data-stock="${p.quantity}">${p.name} (склад: ${p.quantity})</option>`
    ).join('');

    const row = document.createElement('div');
    row.className = 'row g-2 align-items-center mb-2 sale-item-row';
    row.id = rid;
    row.innerHTML = `
      <div class="col">
        <select class="form-select form-select-sm prod-select" required>
          <option value="">Выберите товар...</option>
          ${opts}
        </select>
      </div>
      <div class="col-auto" style="width:110px">
        <input type="number" class="form-control form-control-sm qty-input"
               placeholder="Кол-во" min="1" value="1" required>
      </div>
      <div class="col-auto" style="width:95px">
        <input type="number" class="form-control form-control-sm price-input"
               placeholder="Цена ₽" min="0" step="0.01" required>
      </div>
      <div class="col-auto text-muted fw-medium row-total" style="min-width:82px">0 ₽</div>
      <div class="col-auto">
        <button type="button" class="btn btn-sm btn-outline-danger btn-remove">
          <i class="bi bi-trash"></i>
        </button>
      </div>
      <div class="col-12 stock-warning d-none">
        <div class="alert alert-danger py-1 px-2 mb-0 d-flex align-items-center gap-2" style="font-size:.82rem">
          <i class="bi bi-exclamation-circle-fill"></i>
          <span class="stock-warning-text"></span>
        </div>
      </div>`;

    const prodSelect = row.querySelector('.prod-select');
    const qtyInput   = row.querySelector('.qty-input');
    const priceInput = row.querySelector('.price-input');

    // Валидация остатка при вводе
    function validateStock() {
      const prodId  = parseInt(prodSelect.value, 10);
      const qty     = parseInt(qtyInput.value, 10) || 0;
      const avail   = prodId ? (stock[prodId] ?? 0) : Infinity;
      const warning = row.querySelector('.stock-warning');
      const wText   = row.querySelector('.stock-warning-text');

      if (prodId && qty > avail) {
        qtyInput.classList.add('is-invalid');
        warning.classList.remove('d-none');
        wText.textContent = `Запрошено ${qty} шт. — на складе только ${avail} шт.`;
      } else {
        qtyInput.classList.remove('is-invalid');
        warning.classList.add('d-none');
      }
      updateRowTotal(row);
    }

    prodSelect.addEventListener('change', () => {
      validateStock();
      updatePriceFromList(row);
    });
    qtyInput.addEventListener('input', validateStock);
    priceInput.addEventListener('input', () => updateRowTotal(row));

    row.querySelector('.btn-remove').addEventListener('click', () => {
      row.remove();
      if (!itemsContainer.querySelector('.sale-item-row')) {
        emptyMsg.classList.remove('d-none');
      }
      recalculate();
    });

    itemsContainer.appendChild(row);
    // При надобности поставим цену сразу
    updatePriceFromList(row);
  }

  // Обновить цену во всех строках при смене прайс-листа
  selectPriceList.addEventListener('change', () => {
    document.querySelectorAll('.sale-item-row').forEach(updatePriceFromList);
    recalculate();
  });

  function updatePriceFromList(row) {
    const plId   = parseInt(selectPriceList.value, 10);
    const prodId = parseInt(row.querySelector('.prod-select').value, 10);
    const pInput = row.querySelector('.price-input');
    
    if (plId && prodId) {
      const match = PRICES_DATA.find(p => p.id_price_list === plId && p.id_product === prodId);
      if (match) {
        pInput.value = match.price;
        updateRowTotal(row);
      }
    }
  }

  function updateRowTotal(row) {
    const qty   = parseFloat(row.querySelector('.qty-input').value)   || 0;
    const price = parseFloat(row.querySelector('.price-input').value) || 0;
    row.querySelector('.row-total').textContent = fmt(qty * price);
    recalculate();
  }

  // ── Пересчёт итогов ──────────────────────────────────────────
  function recalculate() {
    let subtotal = 0;
    document.querySelectorAll('.sale-item-row').forEach(row => {
      const qty   = parseFloat(row.querySelector('.qty-input').value)   || 0;
      const price = parseFloat(row.querySelector('.price-input').value) || 0;
      subtotal += qty * price;
    });
    const discAmt = subtotal * (currentDiscount / 100);
    const total   = subtotal - discAmt;

    subtotalDisplay.textContent       = fmt(subtotal);
    discountAmountDisplay.textContent = `−${fmt(discAmt)}`;
    totalDisplay.textContent          = fmt(total);
  }

  function fmt(n) {
    return n.toLocaleString('ru-RU', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' ₽';
  }

  // ── Отправка формы ───────────────────────────────────────────
  btnSubmit.addEventListener('click', async () => {
    const customerId  = parseInt(selectCustomer.value, 10);
    const priceListId = parseInt(selectPriceList.value, 10);

    if (!customerId)  { showToast('Выберите клиента!', 'danger');    return; }
    if (!priceListId) { showToast('Выберите прайс-лист!', 'danger'); return; }

    const rows = document.querySelectorAll('.sale-item-row');
    if (rows.length === 0) { showToast('Добавьте хотя бы один товар!', 'danger'); return; }

    // ── Клиентская проверка остатка (уровень 1) ─────────────
    let clientError = null;
    const items = [];

    rows.forEach(row => {
      if (clientError) return;
      const prodId = parseInt(row.querySelector('.prod-select').value, 10);
      const qty    = parseInt(row.querySelector('.qty-input').value, 10);
      const price  = parseFloat(row.querySelector('.price-input').value);
      const avail  = stock[prodId] ?? 0;
      const prod   = PRODUCTS_DATA.find(p => p.id === prodId);

      if (!prodId || !qty || !price) {
        clientError = { msg: 'Заполните все поля в строках товаров!', toast: true };
        return;
      }
      if (qty > avail) {
        clientError = { prodName: prod?.name || '?', requested: qty, available: avail };
        return;
      }
      items.push({ id_product: prodId, quantity: qty, unit_price: price });
    });

    if (clientError) {
      if (clientError.toast) { showToast(clientError.msg, 'danger'); return; }
      stockErrorMsg.textContent       = `«${clientError.prodName}»`;
      stockErrorRequested.textContent = clientError.requested;
      stockErrorAvailable.textContent = clientError.available;
      stockErrorModal.show();
      return;
    }

    // ── Отправка на сервер ───────────────────────────────────
    const subtotal    = items.reduce((s, i) => s + i.quantity * i.unit_price, 0);
    const totalAmount = +(subtotal * (1 - currentDiscount / 100)).toFixed(2);

    btnSubmit.disabled = true;
    btnSubmit.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Сохранение...';

    try {
      // 1. Создаём запись продажи
      const saleRes = await fetch('/api/sale', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id_customer: customerId, 
          id_price_list: priceListId,
          sale_date: new Date().toISOString(), 
          total_amount: totalAmount,
        }),
      });
      if (!saleRes.ok) throw new Error(`Ошибка создания продажи (${saleRes.status})`);
      const sale = await saleRes.json();

      // 2. Добавляем позиции — сервер проверяет и декрементирует
      for (const item of items) {
        const r = await fetch('/api/prodisonsale', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            id_sale: sale.id, 
            id_product: item.id_product, 
            quantity: item.quantity,
            price: item.unit_price // Отправляем цену продажи
          }),
        });

        if (!r.ok) {
          if (r.status === 409) {
            const err = await r.json();
            stockErrorMsg.textContent       = `«${err.product || '?'}»`;
            stockErrorRequested.textContent = err.requested ?? item.quantity;
            stockErrorAvailable.textContent = err.available ?? '?';
            // Откатываем созданную продажу
            await fetch(`/api/sale/${sale.id}`, { method: 'DELETE' }).catch(() => {});
            stockErrorModal.show();
            return;
          }
          throw new Error(`Ошибка сохранения позиции (${r.status})`);
        }

        // Обновляем локальный склад после успешной записи
        stock[item.id_product] = Math.max(0, (stock[item.id_product] ?? 0) - item.quantity);
      }

      showToast('Продажа успешно оформлена!', 'success');
      bootstrap.Modal.getInstance(document.getElementById('saleModal')).hide();
      setTimeout(() => location.reload(), 700);

    } catch (err) {
      showToast(err.message || 'Произошла ошибка', 'danger');
    } finally {
      btnSubmit.disabled = false;
      btnSubmit.innerHTML = '<i class="bi bi-check-lg me-1"></i>Оформить продажу';
    }
  });

  // ── Просмотр чека ───────────────────────────────────────────
  const receiptModal      = new bootstrap.Modal(document.getElementById('receiptModal'));
  const receiptSaleId     = document.getElementById('receiptSaleId');
  const receiptDate       = document.getElementById('receiptDate');
  const receiptCustomer   = document.getElementById('receiptCustomer');
  const receiptTotal      = document.getElementById('receiptTotal');
  const btnDownloadPDF    = document.getElementById('btnDownloadPDF');

  if (btnDownloadPDF) {
    btnDownloadPDF.addEventListener('click', () => {
      const element = document.querySelector('#receiptModal .modal-body');
      const saleId = document.getElementById('receiptSaleId').textContent;
      
      const opt = {
        margin:       10,
        filename:     `receipt-${saleId}.pdf`,
        image:        { type: 'jpeg', quality: 0.98 },
        html2canvas:  { scale: 2 },
        jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
      };

      // Добавляем заголовок перед сохранением
      const header = document.createElement('div');
      header.innerHTML = `
        <div style="text-align: center; margin-bottom: 20px;">
          <h1 style="color: #6366f1; margin-bottom: 5px;">Flover Shop</h1>
          <p style="color: #666; font-size: 12px;">Электронный чек на покупку</p>
        </div>
      `;
      
      const content = element.cloneNode(true);
      const container = document.createElement('div');
      container.appendChild(header);
      container.appendChild(content);

      html2pdf().set(opt).from(container).save();
    });
  }
  const receiptItemsBody  = document.getElementById('receiptItemsBody');
  const receiptTable      = document.getElementById('receiptItemsTable');
  const receiptLoader     = document.getElementById('receiptItemsLoader');
  const receiptNoItems    = document.getElementById('receiptNoItems');

  document.addEventListener('click', async (e) => {
    const btn = e.target.closest('.btn-receipt');
    if (!btn) return;

    const saleId = btn.dataset.saleId;
    
    // Заполняем заголовок из атрибутов кнопки
    receiptSaleId.textContent = `#${saleId}`;
    receiptDate.textContent     = btn.dataset.saleDate;
    receiptCustomer.textContent = btn.dataset.customer;
    receiptTotal.textContent    = btn.dataset.total + ' ₽';

    // Показываем лоадер и открываем модал
    receiptLoader.classList.remove('d-none');
    receiptTable.classList.add('d-none');
    receiptNoItems.classList.add('d-none');
    receiptItemsBody.innerHTML = '';
    receiptModal.show();

    try {
      const res = await fetch(`/api/sale/${saleId}/saleWithProducts`);
      if (!res.ok) throw new Error('Ошибка загрузки чека');
      
      const items = await res.json();
      receiptLoader.classList.add('d-none');

      if (!items || items.length === 0) {
        receiptNoItems.classList.remove('d-none');
      } else {
        receiptTable.classList.remove('d-none');
        items.forEach(item => {
          const tr = document.createElement('tr');
          const rowTotal = (item.quantity * (item.price || 0));
          tr.innerHTML = `
            <td>
              <div class="fw-medium">${item.product_name || 'Удаленный товар'}</div>
            </td>
            <td class="text-center">${item.quantity} шт.</td>
            <td class="text-end">${Number(item.price || 0).toLocaleString('ru')} ₽</td>
            <td class="text-end fw-bold">${rowTotal.toLocaleString('ru')} ₽</td>
          `;
          receiptItemsBody.appendChild(tr);
        });
      }
    } catch (err) {
      receiptLoader.classList.add('d-none');
      showToast(err.message, 'danger');
    }
  });

})();
