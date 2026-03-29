export type Role = 'admin' | 'employee' | 'new_employee'

export interface ToolkitItem {
  id: string
  label: string
  checked: boolean
}

export interface Employee {
  id: number
  name: string
  email: string
  role: Role
  position: string
  department: string
  joinDate: string
  avatar?: string
  toolkit: ToolkitItem[]
}

const DEFAULT_TOOLKIT: ToolkitItem[] = [
  { id: 'nda',        label: 'Sign NDA',                   checked: false },
  { id: 'handbook',   label: 'Read Employee Handbook',     checked: false },
  { id: 'it_setup',   label: 'IT Setup (laptop + access)', checked: false },
  { id: 'hr_docs',    label: 'Submit HR Documents',        checked: false },
  { id: 'intro',      label: 'Team Introduction Meeting',  checked: false },
]

export let employees: Employee[] = [
  {
    id: 1,
    name: 'Admin User',
    email: 'admin@andal.com',
    role: 'admin',
    position: 'HR Manager',
    department: 'Human Resources',
    joinDate: '2022-01-15',
    toolkit: DEFAULT_TOOLKIT.map(t => ({ ...t, checked: true })),
  },
  {
    id: 2,
    name: 'Employee User',
    email: 'employee@andal.com',
    role: 'employee',
    position: 'Software Engineer',
    department: 'Engineering',
    joinDate: '2023-03-10',
    toolkit: DEFAULT_TOOLKIT.map(t => ({ ...t, checked: true })),
  },
  {
    id: 3,
    name: 'Alex (New Employee)',
    email: 'newbie@andal.com',
    role: 'new_employee',
    position: 'Junior Designer',
    department: 'Product',
    joinDate: '2026-03-01',
    toolkit: DEFAULT_TOOLKIT.map((t, i) => ({ ...t, checked: i < 2 })),
  },
  {
    id: 4,
    name: 'Budi Santoso',
    email: 'budi@andal.com',
    role: 'employee',
    position: 'Sales Executive',
    department: 'Sales',
    joinDate: '2023-06-20',
    toolkit: DEFAULT_TOOLKIT.map(t => ({ ...t, checked: true })),
  },
  {
    id: 5,
    name: 'Alisa Thompson',
    email: 'alisa@andal.com',
    role: 'employee',
    position: 'Senior Software Engineer',
    department: 'Engineering',
    joinDate: '2022-09-05',
    toolkit: DEFAULT_TOOLKIT.map(t => ({ ...t, checked: true })),
  },
  {
    id: 6,
    name: 'David Chen',
    email: 'david@andal.com',
    role: 'employee',
    position: 'Marketing Manager',
    department: 'Marketing',
    joinDate: '2021-11-12',
    toolkit: DEFAULT_TOOLKIT.map(t => ({ ...t, checked: true })),
  },
  {
    id: 7,
    name: 'Sarah Johnson',
    email: 'sarah@andal.com',
    role: 'employee',
    position: 'HR Specialist',
    department: 'Human Resources',
    joinDate: '2023-01-08',
    toolkit: DEFAULT_TOOLKIT.map(t => ({ ...t, checked: true })),
  },
]

export function getEmployee(id: number) {
  return employees.find(e => e.id === id)
}

export function addEmployee(data: Omit<Employee, 'id'>) {
  const newId = Math.max(...employees.map(e => e.id)) + 1
  const newEmp = { ...data, id: newId }
  employees = [...employees, newEmp]
  return newEmp
}

export function updateEmployee(id: number, data: Partial<Omit<Employee, 'id'>>) {
  employees = employees.map(e => e.id === id ? { ...e, ...data } : e)
}

export function deleteEmployee(id: number) {
  employees = employees.filter(e => e.id !== id)
}
