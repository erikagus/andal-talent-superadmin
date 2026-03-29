export type Role = 'employee' | 'new_employee'

export interface ToolkitItem {
  id: string
  label: string
  checked: boolean
}

export interface Employee {
  id: number
  name: string
  email: string
  password: string
  role: Role
  onboardingDone: boolean
  toolkit: ToolkitItem[]
}

export const DEFAULT_TOOLKIT: ToolkitItem[] = [
  { id: 'nda',      label: 'Sign NDA',                    checked: false },
  { id: 'handbook', label: 'Read Employee Handbook',      checked: false },
  { id: 'it_setup', label: 'IT Setup (laptop + access)',  checked: false },
  { id: 'hr_docs',  label: 'Submit HR Documents',         checked: false },
  { id: 'intro',    label: 'Team Introduction Meeting',   checked: false },
]

const STORAGE_KEY = 'sa_employees'

const SEED: Employee[] = [
  {
    id: 1,
    name: 'Admin User',
    email: 'admin@andal.com',
    password: 'admin123',
    role: 'employee',
    onboardingDone: true,
    toolkit: DEFAULT_TOOLKIT.map(t => ({ ...t, checked: true })),
  },
  {
    id: 2,
    name: 'Employee User',
    email: 'employee@andal.com',
    password: 'employee123',
    role: 'employee',
    onboardingDone: true,
    toolkit: DEFAULT_TOOLKIT.map(t => ({ ...t, checked: true })),
  },
  {
    id: 3,
    name: 'Alex (New Employee)',
    email: 'newbie@andal.com',
    password: 'newbie123',
    role: 'new_employee',
    onboardingDone: false,
    toolkit: DEFAULT_TOOLKIT.map((t, i) => ({ ...t, checked: i < 2 })),
  },
  {
    id: 4,
    name: 'Budi Santoso',
    email: 'budi@andal.com',
    password: 'budi123',
    role: 'employee',
    onboardingDone: true,
    toolkit: DEFAULT_TOOLKIT.map(t => ({ ...t, checked: true })),
  },
  {
    id: 5,
    name: 'Alisa Thompson',
    email: 'alisa@andal.com',
    password: 'alisa123',
    role: 'employee',
    onboardingDone: true,
    toolkit: DEFAULT_TOOLKIT.map(t => ({ ...t, checked: true })),
  },
  {
    id: 6,
    name: 'David Chen',
    email: 'david@andal.com',
    password: 'david123',
    role: 'employee',
    onboardingDone: true,
    toolkit: DEFAULT_TOOLKIT.map(t => ({ ...t, checked: true })),
  },
  {
    id: 7,
    name: 'Sarah Johnson',
    email: 'sarah@andal.com',
    password: 'sarah123',
    role: 'employee',
    onboardingDone: true,
    toolkit: DEFAULT_TOOLKIT.map(t => ({ ...t, checked: true })),
  },
]

function load(): Employee[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw) as Employee[]
  } catch { /* ignore */ }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED))
  return SEED
}

function save(list: Employee[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list))
}

export function getAll(): Employee[] { return load() }

export function getById(id: number): Employee | undefined {
  return load().find(e => e.id === id)
}

export function addEmployee(data: Omit<Employee, 'id'>): Employee {
  const list = load()
  const newId = list.length > 0 ? Math.max(...list.map(e => e.id)) + 1 : 1
  const emp = { ...data, id: newId }
  save([...list, emp])
  return emp
}

export function updateEmployee(id: number, patch: Partial<Omit<Employee, 'id'>>) {
  const list = load()
  const updated = list.map(e => {
    if (e.id !== id) return e
    const merged = { ...e, ...patch }
    // auto-promote: if all toolkit items are checked → onboardingDone = true → role = 'employee'
    const allDone = merged.toolkit.every(t => t.checked)
    if (allDone) {
      merged.onboardingDone = true
      merged.role = 'employee'
    }
    return merged
  })
  save(updated)
}

export function deleteEmployee(id: number) {
  save(load().filter(e => e.id !== id))
}
