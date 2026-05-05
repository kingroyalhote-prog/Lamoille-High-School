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
  let synced = 0
  const skippedRoles = []

  try {
    const rolesRes = await fetch(
      `https://groups.roblox.com/v1/groups/${GROUP_ID}/roles`,
      { cache: "no-store" }
    )

    const rolesJson = await rolesRes.json()
    const roles = rolesJson.roles || []

    for (const role of roles) {
      const category = ROLE_MAP[role.name]
      if (!category) continue

      let cursor = null

      do {
        const url = cursor
          ? `https://groups.roblox.com/v1/groups/${GROUP_ID}/roles/${role.id}/users?limit=10&cursor=${encodeURIComponent(cursor)}`
          : `https://groups.roblox.com/v1/groups/${GROUP_ID}/roles/${role.id}/users?limit=10`

        const usersRes = await fetch(url, { cache: "no-store" })
        const usersJson = await usersRes.json()

        if (usersJson.errors) {
          skippedRoles.push(role.name)
          break
        }

        const users = usersJson.data || []

        for (const user of users) {
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

        cursor = usersJson.nextPageCursor
      } while (cursor)
    }

    return NextResponse.json({
      success: true,
      synced,
      skippedRoles,
    })
  } catch (err) {
    return NextResponse.json({
      success: false,
      error: err.message,
    })
  }
}
