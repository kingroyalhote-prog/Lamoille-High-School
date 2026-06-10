export async function POST(request) {
  try {
    const body = await request.json()

    const webhookUrl = body.webhookUrl

    if (!webhookUrl) {
      return Response.json(
        { ok: false, error: "Missing webhook URL" },
        { status: 400 }
      )
    }

    await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        embeds: [
          {
            title: body.title || "Staff Database Log",
            description:
              body.description ||
              "A staff database action was recorded.",
            color: body.color || 15158332,
            fields: body.fields || [],
            timestamp: new Date().toISOString(),
            footer: {
              text: "Lamoille High School Staff Database",
            },
          },
        ],
      }),
    })

    return Response.json({ ok: true })
  } catch (error) {
    return Response.json(
      { ok: false, error: String(error) },
      { status: 500 }
    )
  }
}
