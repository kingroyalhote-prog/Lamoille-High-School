import { NextResponse } from "next/server"
import { Resend } from "resend"
import { supabase } from "../../../../../lib/supabase"

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request, { params }) {
  try {
    const { id } = params
    const { status, denialReason } = await request.json()

    if (!["accepted", "denied"].includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 })
    }

    if (status === "denied" && !denialReason?.trim()) {
      return NextResponse.json(
        { error: "Denial reason is required" },
        { status: 400 }
      )
    }

    const { data: application, error: fetchError } = await supabase
      .from("applications")
      .select("*")
      .eq("id", id)
      .single()

    if (fetchError || !application) {
      return NextResponse.json({ error: "Application not found" }, { status: 404 })
    }

    const { error: updateError } = await supabase
      .from("applications")
      .update({
        status,
        denial_reason: status === "denied" ? denialReason : null,
        reviewed_at: new Date().toISOString(),
      })
      .eq("id", id)

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 })
    }

    const applicantEmail =
      application.email ||
      application.applicant_email ||
      application.contact_email

    if (!applicantEmail) {
      return NextResponse.json({
        success: true,
        message: "Application updated, but no email was found.",
      })
    }

    const applicantName =
      application.full_name ||
      application.name ||
      "Applicant"

    const subject =
      status === "accepted"
        ? "Your Lamoille High School Application Result"
        : "Update Regarding Your Lamoille High School Application"

    const text =
      status === "accepted"
        ? `Hello ${applicantName},

Congratulations! Your application has been accepted.

A staff member from Lamoille High School will follow up with you soon regarding the next steps.

Thank you,
Lamoille High School`
        : `Hello ${applicantName},

Thank you for applying to Lamoille High School.

After reviewing your application, we are unable to accept it at this time.

Reason:
${denialReason}

Thank you,
Lamoille High School`

    await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL,
      to: applicantEmail,
      subject,
      text,
    })

    return NextResponse.json({
      success: true,
      message: `Application ${status} and email sent.`,
    })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
