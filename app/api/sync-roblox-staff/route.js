import { NextResponse } from "next/server"
import { supabaseAdmin } from "../../../lib/supabaseAdmin"

const GROUP_ID = "1048796934"

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
  return ROLE_MAP[roleName] || null
}

export async function GET() {
  let cursor = null
  let synced = 0

  try {
    do {
      const url = cursor
        ? `https://groups.roblox.com/v1/groups/${GROUP_ID}/users?limit=100&cursor=${encodeURIComponent(cursor)}`
        : `https://groups.roblox.com/v1/groups/${GROUP_ID}/users?limit=10`

      console.log("ROBLOX URL:", url)

      const res = await fetch(url, {
        cache: "no-store",
      })

      const json = await res.json()

      console.log("ROBLOX RESPONSE:", JSON.stringify(json))

      if (json.errors) {
        return NextResponse.json({
          success: false,
          urlUsed: url,
          robloxResponse: json,
        })
      }

      const members = json.data || []

      for (const member of members) {
        const user = member.user
        const role = member.role

        if (!user || !role) continue

        const category = getCategory(role.name)

        // Skip regular group members who are not staff roles
        if (!category) continue

        const userId = user.userId || user.id
        const username = user.username || user.name
        const displayName = user.displayName || user.name || user.username

        if (!userId || !username) continue

        const { error } = await supabaseAdmin.from("staff_members").upsert(
          {
            roblox_user_id: userId,
            roblox_username: username,
            full_name: displayName,
            title: role.name,
            category,
            is_active: true,
            image_url: `https://www.roblox.com/headshot-thumbnail/image?userId=${userId}&width=180&height=180&format=png`,
          },
          {
            onConflict: "roblox_user_id",
          }
        )

        if (error) {
          console.error("SUPABASE ERROR:", error)
        } else {
          synced++
        }
      }

      cursor = json.nextPageCursor
    } while (cursor)

    return NextResponse.json({
      success: true,
      synced,
    })
  } catch (err) {
    return NextResponse.json({
      success: false,
      error: err.message,
    })
  }
}
