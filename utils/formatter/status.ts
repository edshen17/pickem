import { ResultStatus } from '~/view-models/pool'

export function formatResultStatus(status: ResultStatus): string {
  switch (status) {
    case ResultStatus.NOT_AVAILABLE:
      return 'Not Available'
    case ResultStatus.NOT_STARTED:
      return 'Not Started'
    case ResultStatus.IN_PROGRESS:
      return 'In Progress'
    case ResultStatus.FINALIZED:
      return 'Finalized'
    default:
      throw new Error(`Unknown result status: ${status}`)
  }
}
