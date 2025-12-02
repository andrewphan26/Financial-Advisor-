import requestSrv from './index'

const BASE_PATH = '/customer/spendings'

// Normalize backend row -> frontend model expected by Spendings.vue
function mapRow(row) {
  const amount = Number(row.amount ?? 0)

  // normalize date to YYYY-MM-DD if possible
  let dateStr = row.date
  try {
    if (row.date) {
      const d = new Date(row.date)
      if (!isNaN(d)) dateStr = d.toISOString().slice(0, 10)
    }
  } catch (_) {}

  return {
    id: row.id,
    date: dateStr,
    description: row.notes || '',
    category: row.category || '',
    sub_category: row.subcategory || '',
    amount,
  }
}

// GET all spendings for current user
async function getSpendings() {
  const res = await requestSrv({ path: BASE_PATH, method: 'GET' })
  return (res.data || []).map(mapRow)
}

// Create a spending
// Accepts: { date, category, sub_category, amount, description }
// Note: "data" alias supported for date in case of typo.
async function createSpending(payload) {
  const { date, data, category, sub_category, amount, description } = payload || {}
  const body = {
    amount: Number(amount || 0),
    date: date || data || new Date().toISOString(),
    category: category || null,
    subcategory: sub_category || null,
    notes: description || null,
  }
  const res = await requestSrv({ path: BASE_PATH, method: 'POST', data: body })
  return mapRow(res.data)
}

// Update a spending by id
// Accepts same shape as createSpending
async function updateSpending(id, payload) {
  const { date, data, category, sub_category, amount, description } = payload || {}
  const body = {
    amount: amount != null ? Number(amount) : undefined,
    date: date || data || undefined,
    category,
    subcategory: sub_category,
    notes: description || undefined,
  }
  const res = await requestSrv({ path: `${BASE_PATH}/${id}`, method: 'PUT', data: body })
  return mapRow(res.data)
}

// Delete a spending by id
async function deleteSpending(id) {
  await requestSrv({ path: `${BASE_PATH}/${id}`, method: 'DELETE' })
  return true
}

// Get monthly budget
async function getMonthlyBudget() {
  const res = await requestSrv({ path: `${BASE_PATH}/budget/monthly`, method: 'GET' })
  return res.data.monthlyBudget
}

// Update monthly budget
async function updateMonthlyBudget(monthlyBudget) {
  const res = await requestSrv({ 
    path: `${BASE_PATH}/budget/monthly`, 
    method: 'PUT', 
    data: { monthlyBudget } 
  })
  return res.data.monthlyBudget
}

export default { 
  getSpendings, 
  createSpending, 
  updateSpending, 
  deleteSpending,
  getMonthlyBudget,
  updateMonthlyBudget
}
