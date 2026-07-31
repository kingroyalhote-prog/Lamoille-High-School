import SchoolBoardResultsCountdown from "../../components/SchoolBoardResultsCountdown"
import {
  SCHOOL_BOARD_RESULTS_RELEASE_AT,
  areSchoolBoardResultsReleased,
} from "../../lib/schoolBoardResults"

export const dynamic = "force-dynamic"

export default function SchoolBoardResultsPage() {
  const released = areSchoolBoardResultsReleased()

  return (
    <main className="results-gate-page">
      <section className="results-gate-card">
        <p className="results-gate-pill">Lamoille ISD</p>

        <h1>School Board Results</h1>

        {released ? (
          <>
            <p className="results-gate-subtitle">
              Results are now available.
            </p>

            <div className="results-image-frame">
              <img
                src="/api/school-board-results/image"
                alt="Lamoille ISD school board election results"
              />
            </div>
          </>
        ) : (
          <>
            <p className="results-gate-subtitle">
              Results are locked until the official release time.
            </p>

            <SchoolBoardResultsCountdown
              releaseAt={SCHOOL_BOARD_RESULTS_RELEASE_AT}
            />

            <p className="results-gate-note">
              The results image will appear here automatically when the
              countdown ends.
            </p>
          </>
        )}
      </section>
    </main>
  )
}
