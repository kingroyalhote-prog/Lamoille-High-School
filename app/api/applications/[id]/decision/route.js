import { NextResponse } from "next/server"
import { Resend } from "resend"
import { createClient } from "@supabase/supabase-js"

export async function POST(request, { params }) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !serviceRoleKey) {
      return NextResponse.json(
        { error: "Server email and database settings are not configured." },
        { status: 503 }
      )
    }

    const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey)
    const resend = process.env.RESEND_API_KEY
      ? new Resend(process.env.RESEND_API_KEY)
      : null

    const { id } = await params
    const { status, denialReason } = await request.json()

    if (!["accepted", "denied"].includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 })
    }

    if (status === "denied" && !denialReason?.trim()) {
      return NextResponse.json({ error: "Denial reason is required" }, { status: 400 })
    }

    const { data: application, error: fetchError } = await supabaseAdmin
      .from("applications")
      .select("*")
      .eq("id", id)
      .single()

    if (fetchError || !application) {
      return NextResponse.json({ error: "Application not found" }, { status: 404 })
    }

    const { data: updatedApplication, error: updateError } = await supabaseAdmin
      .from("applications")
      .update({
        status: status,
        denial_reason: status === "denied" ? denialReason : null,
        reviewed_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select("*")
      .single()

    if (updateError || !updatedApplication) {
      return NextResponse.json(
        { error: updateError?.message || "Status update failed." },
        { status: 500 }
      )
    }

    await supabaseAdmin.from("application_review_logs").insert({
      application_id: id,
      action: status,
      reason: status === "denied" ? denialReason : null,
    })

    const applicantEmail = application.email

    if (applicantEmail && resend) {
      await resend.emails.send({
        from: process.env.RESEND_FROM_EMAIL,
        to: applicantEmail,
        subject:
          status === "accepted"
            ? "Your Lamoille High School Application Result"
            : "Update Regarding Your Lamoille High School Application",
        text:
          status === "accepted"
            ? `Hello ${application.full_name || "Applicant"},

Congratulations! Your application has been accepted.

Thank you,
Lamoille High School`
            : `Hello ${application.full_name || "Applicant"},

Thank you for applying to Lamoille High School.

After reviewing your application, we are unable to accept it at this time.

Reason:
${denialReason}

Thank you,
Lamoille High School`,
      })
    }

    return NextResponse.json({
      success: true,
      message: `Application ${status} and email sent.`,
      updatedApplication,
    })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
