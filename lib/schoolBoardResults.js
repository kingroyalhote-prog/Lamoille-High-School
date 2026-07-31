export const SCHOOL_BOARD_RESULTS_ENABLED = true

export const SCHOOL_BOARD_RESULTS_RELEASE_AT = "2026-07-31T00:15:00-04:00"

export const SCHOOL_BOARD_RESULTS_IMAGE_PATH =
  "private/school-board-results/results.png"

export function getSchoolBoardResultsReleaseTime() {
  return new Date(SCHOOL_BOARD_RESULTS_RELEASE_AT).getTime()
}

export function areSchoolBoardResultsReleased(now = Date.now()) {
  return now >= getSchoolBoardResultsReleaseTime()
}
