import { readFile } from "fs/promises"
import path from "path"
import {
  SCHOOL_BOARD_RESULTS_IMAGE_PATH,
  areSchoolBoardResultsReleased,
} from "../../../../lib/schoolBoardResults"

export const dynamic = "force-dynamic"
export const runtime = "nodejs"

function getContentType(filePath) {
  const extension = path.extname(filePath).toLowerCase()

  if (extension === ".jpg" || extension === ".jpeg") return "image/jpeg"
  if (extension === ".webp") return "image/webp"
  return "image/png"
}

export async function GET() {
  if (!areSchoolBoardResultsReleased()) {
    return new Response("Results are not released yet.", {
      status: 404,
      headers: {
        "Cache-Control": "no-store",
      },
    })
  }

  try {
    const imagePath = path.join(process.cwd(), SCHOOL_BOARD_RESULTS_IMAGE_PATH)
    const image = await readFile(imagePath)

    return new Response(image, {
      headers: {
        "Content-Type": getContentType(SCHOOL_BOARD_RESULTS_IMAGE_PATH),
        "Cache-Control": "no-store",
      },
    })
  } catch {
    return new Response("Results image has not been uploaded yet.", {
      status: 404,
      headers: {
        "Cache-Control": "no-store",
      },
    })
  }
}
