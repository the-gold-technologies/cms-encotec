import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getTransporter } from "@/lib/mailer";

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  });
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const search = searchParams.get("search") || "";
    const skip = (page - 1) * limit;

    const where = search
      ? {
          OR: [
            { name: { contains: search, mode: "insensitive" as any } },
            { email: { contains: search, mode: "insensitive" as any } },
          ],
        }
      : {};

    const [enquiries, total] = await Promise.all([
      prisma.enquiry.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      prisma.enquiry.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      data: enquiries,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Enquiries fetch error:", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, interestedIn, budget, projectGoals, phone, companyName, message, subject } = body;

    if (!name || !email) {
      return NextResponse.json(
        { success: false, error: "Name and email are required" },
        { status: 400, headers: { "Access-Control-Allow-Origin": "*" } },
      );
    }

    const enquiry = await prisma.enquiry.create({
      data: {
        name,
        email,
        interestedIn: interestedIn || subject || "General Inquiry",
        budget: budget || null,
        projectGoals: projectGoals || message || "",
      },
    });

    // Email notification dispatch to Sales (from .env or dynamic CMS page configuration)
    let emailSent = false;
    let emailError = null;
    let salesRecipient = process.env.SALES_EMAIL;
    if (!salesRecipient) {
      try {
        const contactPage = await prisma.page.findUnique({
          where: { slug: "contact" },
          include: { sections: true },
        });
        const infoSection = contactPage?.sections.find(
          (s: any) => s.type === "ContactInfo",
        );
        if (infoSection && typeof infoSection.content === "object") {
          const content = infoSection.content as any;
          if (content?.emailAddress) {
            salesRecipient = content.emailAddress;
          }
        }
      } catch (e) {}
    }

    const smtpData = getTransporter();

    if (smtpData && salesRecipient) {
      try {
        const htmlBody = `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; color: #222; max-width: 650px; margin: 0 auto; border: 1px solid #e5e7eb; border-radius: 12px; overflow: hidden; background-color: #ffffff;">
            <div style="background-color: #0A0F29; padding: 28px; text-align: center; border-bottom: 4px solid #a0004f;">
              <h2 style="color: #ffffff; margin: 0; font-size: 22px; text-transform: uppercase; letter-spacing: 1.5px; font-weight: 800;">New Sales & Project Inquiry</h2>
              <p style="color: #a0004f; margin: 8px 0 0 0; font-weight: bold; font-size: 15px;">Encotec Energy Website CTA</p>
            </div>
            
            <div style="padding: 28px;">
              <h3 style="margin-top: 0; color: #0A0F29; border-bottom: 2px solid #f3f4f6; padding-bottom: 10px; font-size: 16px; text-transform: uppercase; letter-spacing: 0.5px;">Client Information</h3>
              <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 14px;">
                <tr>
                  <td style="padding: 10px 0; width: 35%; font-weight: bold; color: #6b7280;">Full Name:</td>
                  <td style="padding: 10px 0; color: #111827; font-weight: 600;">${name}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; font-weight: bold; color: #6b7280;">Email Address:</td>
                  <td style="padding: 10px 0; color: #111827;"><a href="mailto:${email}" style="color: #a0004f; text-decoration: none; font-weight: 500;">${email}</a></td>
                </tr>
                ${phone ? `<tr><td style="padding: 10px 0; font-weight: bold; color: #6b7280;">Phone Number:</td><td style="padding: 10px 0; color: #111827;">${phone}</td></tr>` : ""}
                ${companyName ? `<tr><td style="padding: 10px 0; font-weight: bold; color: #6b7280;">Company Name:</td><td style="padding: 10px 0; color: #111827;">${companyName}</td></tr>` : ""}
                <tr>
                  <td style="padding: 10px 0; font-weight: bold; color: #6b7280;">Interested In / Subject:</td>
                  <td style="padding: 10px 0; color: #111827; font-weight: bold;">${interestedIn || subject || "General Inquiry"}</td>
                </tr>
                ${budget ? `<tr><td style="padding: 10px 0; font-weight: bold; color: #6b7280;">Budget:</td><td style="padding: 10px 0; color: #111827;">${budget}</td></tr>` : ""}
              </table>

              ${
                projectGoals || message
                  ? `
                <div style="background: #f9fafb; border-left: 4px solid #a0004f; padding: 16px 20px; margin: 24px 0; border-radius: 0 8px 8px 0;">
                  <strong style="display: block; margin-bottom: 6px; color: #111827; font-size: 13px; text-transform: uppercase;">Project Goals / Message:</strong>
                  <p style="margin: 0; white-space: pre-wrap; color: #374151; font-size: 14px; line-height: 1.6;">${projectGoals || message}</p>
                </div>
              `
                  : ""
              }

              <div style="margin-top: 30px; padding-top: 16px; border-top: 1px solid #f3f4f6; text-align: center;">
                <p style="font-size: 12px; color: #9ca3af; margin: 0;">
                  This inquiry was received via <strong>Encotec Energy CTA / Contact Form</strong> on ${new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })} IST.
                </p>
              </div>
            </div>
          </div>
        `;

        await smtpData.transporter.sendMail({
          from: smtpData.fromAddress,
          to: salesRecipient,
          replyTo: email,
          subject: `[Sales Inquiry] ${name} - ${interestedIn || subject || "New Project Enquiry"}`,
          html: htmlBody,
        });

        emailSent = true;
      } catch (err: any) {
        console.error("Nodemailer error sending sales enquiry email:", err);
        emailError = err.message;
      }
    }

    return NextResponse.json(
      {
        success: true,
        data: enquiry,
        emailSent,
        salesRecipient,
        emailError: emailError || undefined,
      },
      {
        status: 201,
        headers: { "Access-Control-Allow-Origin": "*" },
      },
    );
  } catch (error) {
    console.error("Enquiry submission error:", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500, headers: { "Access-Control-Allow-Origin": "*" } },
    );
  }
}

