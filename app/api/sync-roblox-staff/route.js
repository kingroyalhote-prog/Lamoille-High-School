import { NextResponse } from "next/server"
import { supabaseAdmin } from "../../../lib/supabaseAdmin"

const GROUP_ID = "1048796934"

// Your exact role → category mapping
const ROLE_MAP = {
  "Principal": "Ownership",
  "Assistant Principal": "Ownership",

  "Dean of Students": "Administration",
  "Administration": "Administration",

  "Counselor": "Student Services",
  "Nurse": "Student Services",

  "Core Teacher": "Teachers",
  "Electives Teacher": "Teachers",
  "Substitute Teacher": "Teachers",

  "Contractor": "Faculty",
  "School Resource Officer": "Faculty",
  "Office Secretary": "Faculty",
  "Athletics Department": "Faculty",
  "Campus Supervisor": "Faculty",
}

function getCategory(roleName) {
  return ROLE_MAP[roleName] || "Faculty"
}

export async function GET() {
  let cursor = ""
  let synced = 0

  try {
    do {
      const res = await fetch(
        `https://groups.roblox.com/v1/groups/${GROUP_ID}/users?limit=100${
          cursor ? `&cursor=${cursor}` : ""
        }`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "User-Agent": "Mozilla/5.0",
          },
          cache: "no-store",
        }
      )

      const json = await res.json()
      console.log("ROBLOX RESPONSE:", json)

      const members = json.data || []

      for (const member of members) {
        const user = member.user
        const role = member.role

        // Fix for Roblox field variations
        if (!user || !role || !(user.userId || user.id)) continue

        const userId = user.userId || user.id
        const username = user.username || user.name
        const displayName =
          user.displayName || user.name || user.username

        const category = getCategory(role.name)

        await supabaseAdmin.from("staff_members").upsert(
          {
            roblox_user_id: userId,
            roblox_username: username,
            full_name: displayName,
            title: role.name,
            category: category,
            is_active: true,
            image_url: `https://www.roblox.com/headshot-thumbnail/image?userId=${userId}&width=180&height=180&format=png`,
          },
          {
            onConflict: "roblox_user_id",
          }
        )

        synced++
      }

      cursor = json.nextPageCursor
    } while (cursor)

    return NextResponse.json({
      success: true,
      synced,
    })
  } catch (err) {
    console.error("SYNC ERROR:", err)

    return NextResponse.json(
      { error: err.message },
      { status: 500 }
    )
  }
}
