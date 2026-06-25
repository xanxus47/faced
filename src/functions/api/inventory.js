// functions/api/inventory.js
// Cloudflare Pages Function — replaces inventory_api.php
// Uses Neon (Postgres) via @neondatabase/serverless

import { neon } from '@neondatabase/serverless';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Content-Type': 'application/json; charset=utf-8',
};

const CATEGORY_THRESHOLDS = {
  'Food Inventory':             { low: 10, medium: 15 },
  'Admin Office Inventory':     { low: 10, medium: 20 },
  'Planning Office Inventory':  { low: 10, medium: 20 },
  'Operation Inventory':        { low: 10, medium: 20 },
  'Construction Materials':     { low: 10, medium: 20 },
  'Family Kit':                 { low: 10, medium: 20 },
  'Hygiene Kit':                { low: 10, medium: 20 },
};

// ── helpers ──────────────────────────────────────────────────────────────────

function computeStatus(expirationDate) {
  if (!expirationDate) return 'na';
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const expDate = new Date(expirationDate);
  expDate.setHours(0, 0, 0, 0);
  const diffMs = expDate - today;
  const diffDays = diffMs / (1000 * 60 * 60 * 24);
  if (diffMs < 0)        return 'expired';
  if (diffDays <= 7)     return 'expiring';
  return 'fresh';
}

function statusLabel(status) {
  return { expired: 'Expired', expiring: 'Expiring Soon', fresh: 'Fresh' }[status] ?? 'N/A';
}

function json(data, status = 200) {
  return new Response(JSON.stringify(data), { status, headers: CORS_HEADERS });
}

function today() {
  return new Date().toISOString().slice(0, 10);
}

function daysFromNow(n) {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return d.toISOString().slice(0, 10);
}

// Build parameterised WHERE fragments for Postgres ($1, $2, …)
// Returns { sql: string, params: any[], nextIdx: number }
function buildFilters(source, startIdx, thresholds) {
  let sql = '';
  const params = [];
  let i = startIdx;

  const search    = source.get?.('search')     ?? source.get('search')     ?? '';
  const category  = source.get?.('category')   ?? source.get('category')   ?? '';
  const status    = source.get?.('status')     ?? source.get('status')     ?? '';
  const quantity  = source.get?.('quantity')   ?? source.get('quantity')   ?? '';
  const startDate = source.get?.('start_date') ?? source.get('start_date') ?? '';
  const endDate   = source.get?.('end_date')   ?? source.get('end_date')   ?? '';

  if (search) {
    sql += ` AND (name ILIKE $${i} OR category ILIKE $${i + 1})`;
    params.push(`%${search}%`, `%${search}%`);
    i += 2;
  }

  if (category) {
    sql += ` AND category = $${i}`;
    params.push(category);
    i++;
  }

  if (status) {
    const t = today();
    const nw = daysFromNow(7);
    if (status === 'expired') {
      sql += ` AND expiration_date IS NOT NULL AND expiration_date < $${i}`;
      params.push(t); i++;
    } else if (status === 'expiring') {
      sql += ` AND expiration_date IS NOT NULL AND expiration_date BETWEEN $${i} AND $${i + 1}`;
      params.push(t, nw); i += 2;
    } else if (status === 'fresh') {
      sql += ` AND (expiration_date IS NULL OR expiration_date > $${i})`;
      params.push(nw); i++;
    } else if (status === 'na') {
      sql += ` AND expiration_date IS NULL`;
    }
  }

  if (quantity) {
    const conditions = [];
    for (const [cat, levels] of Object.entries(thresholds)) {
      if (quantity === 'low') {
        conditions.push(`(category = $${i} AND quantity <= $${i + 1})`);
        params.push(cat, levels.low); i += 2;
      } else if (quantity === 'medium') {
        conditions.push(`(category = $${i} AND quantity > $${i + 1} AND quantity <= $${i + 2})`);
        params.push(cat, levels.low, levels.medium); i += 3;
      } else if (quantity === 'high') {
        conditions.push(`(category = $${i} AND quantity > $${i + 1})`);
        params.push(cat, levels.medium); i += 2;
      }
    }
    if (conditions.length) sql += ` AND (${conditions.join(' OR ')})`;
  }

  if (startDate && endDate) {
    sql += ` AND (expiration_date IS NULL OR expiration_date BETWEEN $${i} AND $${i + 1})`;
    params.push(startDate, endDate); i += 2;
  } else if (startDate) {
    sql += ` AND (expiration_date IS NULL OR expiration_date >= $${i})`;
    params.push(startDate); i++;
  } else if (endDate) {
    sql += ` AND (expiration_date IS NULL OR expiration_date <= $${i})`;
    params.push(endDate); i++;
  }

  return { sql, params, nextIdx: i };
}

// ── main handler ─────────────────────────────────────────────────────────────

export async function onRequest(context) {
  const { request, env } = context;

  // Preflight
  if (request.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers: CORS_HEADERS });
  }

  const url    = new URL(request.url);
  const action = url.searchParams.get('action') || '';

  // POST body helper
  let postData = new URLSearchParams();
  if (request.method === 'POST') {
    const ct = request.headers.get('content-type') || '';
    if (ct.includes('application/json')) {
      const body = await request.json();
      postData = new URLSearchParams(Object.entries(body).map(([k, v]) => [k, String(v)]));
    } else {
      postData = new URLSearchParams(await request.text());
    }
  }

  const sql = neon(env.DATABASE_URL);

  // ── GET actions ─────────────────────────────────────────────────────────────

  if (action === 'list') {
    const RECORDS_PER_PAGE = 10;
    const page   = Math.max(1, parseInt(url.searchParams.get('page') || '1'));
    const offset = (page - 1) * RECORDS_PER_PAGE;

    const { sql: filterSql, params: filterParams } = buildFilters(url.searchParams, 1, CATEGORY_THRESHOLDS);

    // Total count
    const countRows = await sql(
      `SELECT COUNT(*) AS cnt FROM inventory_items WHERE 1=1${filterSql}`,
      filterParams
    );
    const totalItems = parseInt(countRows[0].cnt);
    const totalPages = Math.max(1, Math.ceil(totalItems / RECORDS_PER_PAGE));

    // Stats over filtered set
    const statRows = await sql(
      `SELECT expiration_date FROM inventory_items WHERE 1=1${filterSql}`,
      filterParams
    );
    const stats = { totalItems: 0, freshItems: 0, expiringItems: 0, expiredItems: 0, naItems: 0 };
    for (const row of statRows) {
      stats.totalItems++;
      const s = computeStatus(row.expiration_date);
      if (s === 'expired')  stats.expiredItems++;
      else if (s === 'expiring') stats.expiringItems++;
      else if (s === 'fresh')    stats.freshItems++;
      else                       stats.naItems++;
    }

    // Paginated items  — append LIMIT / OFFSET params after filter params
    const limitIdx  = filterParams.length + 1;
    const offsetIdx = filterParams.length + 2;
    const rows = await sql(
      `SELECT * FROM inventory_items WHERE 1=1${filterSql} ORDER BY id DESC LIMIT $${limitIdx} OFFSET $${offsetIdx}`,
      [...filterParams, RECORDS_PER_PAGE, offset]
    );

    const items = rows.map(row => {
      const s = computeStatus(row.expiration_date);
      return {
        id: row.id,
        name: row.name,
        category: row.category,
        quantity: row.quantity,
        unit: row.unit,
        expiration_date: row.expiration_date,
        status: s,
        status_label: statusLabel(s),
      };
    });

    return json({ success: true, items, page, totalPages, totalItems, stats });
  }

  // ── export_csv ──────────────────────────────────────────────────────────────

  if (action === 'export_csv') {
    const { sql: filterSql, params: filterParams } = buildFilters(url.searchParams, 1, CATEGORY_THRESHOLDS);
    const rows = await sql(
      `SELECT * FROM inventory_items WHERE 1=1${filterSql}`,
      filterParams
    );

    const lines = [
      ['Item Name', 'Category', 'Quantity', 'Unit', 'Expiration Date', 'Status'],
      ...rows.map(row => [
        row.name,
        row.category,
        row.quantity,
        row.unit,
        row.expiration_date || 'N/A',
        statusLabel(computeStatus(row.expiration_date)),
      ]),
    ].map(cols => cols.map(c => `"${String(c).replace(/"/g, '""')}"`).join(',')).join('\r\n');

    return new Response('\uFEFF' + lines, {
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="inventory_export_${today()}.csv"`,
        'Access-Control-Allow-Origin': '*',
      },
    });
  }

  // ── history ─────────────────────────────────────────────────────────────────

  if (action === 'history') {
    const rows = await sql(`
      SELECT t.*, i.name AS item_name, i.category
      FROM transactions t
      JOIN inventory_items i ON t.item_id = i.id
      ORDER BY t.created_at DESC
      LIMIT 50
    `);

    const history = rows.map(row => ({
      created_at: row.created_at,
      item_name:  row.item_name,
      category:   row.category,
      type:       row.type,
      type_label: row.type === 'in' ? 'Stock In' : 'Stock Out',
      quantity:   row.quantity,
      user:       row.user,
      names:      row.names,
    }));

    return json({ success: true, history });
  }

  // ── history_csv ──────────────────────────────────────────────────────────────

  if (action === 'history_csv') {
    const rows = await sql(`
      SELECT t.*, i.name AS item_name, i.category
      FROM transactions t
      JOIN inventory_items i ON t.item_id = i.id
      ORDER BY t.created_at DESC
    `);

    const header = ['Transaction Date', 'Item Name', 'Category', 'Transaction Type', 'Quantity', 'User', 'Names'];
    const dataRows = rows.length
      ? rows.map(row => [
          row.created_at,
          row.item_name,
          row.category,
          row.type === 'in' ? 'Stock In' : 'Stock Out',
          row.quantity,
          row.user,
          row.names,
        ])
      : [['Info', 'No transaction history found', '', '', '', '', '']];

    const lines = [header, ...dataRows]
      .map(cols => cols.map(c => `"${String(c ?? '').replace(/\r?\n/g, ' ').replace(/"/g, '""')}"`).join(','))
      .join('\r\n');

    return new Response('\uFEFF' + lines, {
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="transaction_history_${today()}.csv"`,
        'Access-Control-Allow-Origin': '*',
      },
    });
  }

  // ── POST actions ─────────────────────────────────────────────────────────────

  const postAction = action || postData.get('action') || '';

  if (postAction === 'add' || postAction === 'edit') {
    const name           = (postData.get('name') || '').trim();
    const category       = (postData.get('category') || '').trim();
    const quantity       = parseInt(postData.get('quantity') || '0');
    const unit           = (postData.get('unit') || '').trim();
    const expirationDate = (postData.get('expiration_date') || '').trim() || null;

    if (!name || !category || !unit) {
      return json({ success: false, message: 'All fields are required' }, 400);
    }
    if (quantity <= 0) {
      return json({ success: false, message: 'Quantity must be positive' }, 400);
    }

    if (postAction === 'add') {
      const rows = await sql(
        `INSERT INTO inventory_items (name, category, quantity, unit, expiration_date)
         VALUES ($1, $2, $3, $4, $5) RETURNING id`,
        [name, category, quantity, unit, expirationDate]
      );
      return json({ success: true, message: 'Item saved successfully', id: rows[0].id });
    } else {
      const id = parseInt(postData.get('id') || '0');
      await sql(
        `UPDATE inventory_items SET name=$1, category=$2, quantity=$3, unit=$4, expiration_date=$5 WHERE id=$6`,
        [name, category, quantity, unit, expirationDate, id]
      );
      return json({ success: true, message: 'Item saved successfully', id });
    }
  }

  if (postAction === 'delete') {
    const id = parseInt(postData.get('id') || '0');
    await sql(`DELETE FROM inventory_items WHERE id=$1`, [id]);
    return json({ success: true, message: 'Item deleted successfully' });
  }

  if (postAction === 'record_transaction') {
    const itemId   = parseInt(postData.get('item_id') || '0');
    const type     = postData.get('type') || 'in';
    const quantity = parseInt(postData.get('quantity') || '0');
    const names    = (postData.get('names') || '').trim();
    const user     = (postData.get('user') || 'System').trim();

    if (itemId <= 0 || quantity <= 0 || !['in', 'out'].includes(type)) {
      return json({ success: false, message: 'Invalid transaction data' }, 400);
    }

    await sql(
      `INSERT INTO transactions (item_id, type, quantity, user, names) VALUES ($1, $2, $3, $4, $5)`,
      [itemId, type, quantity, user, names]
    );

    const op = type === 'in' ? '+' : '-';
    await sql(
      `UPDATE inventory_items SET quantity = quantity ${op} $1 WHERE id = $2`,
      [quantity, itemId]
    );

    return json({ success: true, message: 'Transaction recorded successfully' });
  }

  return json({ success: false, message: 'Unknown action' }, 400);
}