interface MR {
  mr_number: number,
  change_type: string,
  change_title: string,
  change_description: string,
  change_part: string,
  change_notes: string,
  version: number,
  manufacturer: string,
  requested_by: string,
  wip_check: boolean,
  wip_notes: string,
  design_completed_by: string,
  design_impact: string,
  cost_completed_by: string,
  business_impact: string,
  change_requested_at: Date,
  design_completed_at: Date,
  cost_completed_at: Date,
  status: string,
  attachments: string,
  created_at: Date,
  updated_at: Date,
  deleted_at: Date
}

interface Table {
  open: MR[],
  pending: MR[],
  closed: MR[]
}

export type {MR, Table}