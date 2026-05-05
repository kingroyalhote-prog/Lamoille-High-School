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

export async function GET() {
  let cursor = null
  let synced = 0
  let skipped = 0

  try {
    do {
      const url = cursor
        ? `https://groups.roblox.com/v1/groups/${GROUP_ID}/users?limit=10&cursor=${encodeURIComponent(cursor)}`
        : `https://groups.roblox.com/v1/groups/${GROUP_ID}/users?limit=10`

      const res = await fetch(url, {
        cache: "no-store",
        headers: {
          "User-Agent": "Mozilla/5.0",
        },
      })

      const json = await res.json()

      if (json.errors) {
        return NextResponse.json({
          success: false,
          message:
            "Roblox is blocking the website from reading this group. The group/member list may not be public to outside requests.",
          urlUsed: url,
          robloxResponse: json,
        })
      }

      const members = json.data || []

      for (const member of members) {
        const user = member.user
        const role = member.role

        if (!user || !role) continue

        const category = ROLE_MAP[role.name]

        if (!category) {
          skipped++
          continue
        }

        const userId = user.userId || user.id
        const username = user.username || user.name
        const displayName = user.displayName || user.name || username

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

        if (!error) synced++
      }

      cursor = json.nextPageCursor
    } while (cursor)

    return NextResponse.json({
      success: true,
      synced,
      skipped,
    })
  } catch (err) {
    return NextResponse.json({
      success: false,
      error: err.message,
    })
  }
}
