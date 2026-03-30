export type Role = 'employee' | 'new_employee' | 'admin' | 'superadmin'

export interface ToolkitItem {
  id: string
  label: string
  checked: boolean
}

export interface Employee {
  id: string
  name: string
  email: string
  password: string
  job_position?: string
  avatar_url?: string
  role: Role
  onboarding_done: boolean
  toolkit?: ToolkitItem[]
}

export const DEFAULT_TOOLKIT: ToolkitItem[] = [
  { id: 'nda',      label: 'Sign NDA',                    checked: false },
  { id: 'handbook', label: 'Read Employee Handbook',      checked: false },
  { id: 'it_setup', label: 'IT Setup (laptop + access)',  checked: false },
  { id: 'hr_docs',  label: 'Submit HR Documents',         checked: false },
  { id: 'intro',    label: 'Team Introduction Meeting',   checked: false },
]
