import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import nodemailer from "nodemailer";
import { v2 as cloudinary } from "cloudinary";

// Initialize Cloudinary
cloudinary.config();

function getJobPrisma(): PrismaClient {
  try {
    const prismaKey = Object.keys(require.cache).find((k) => k.includes(".prisma/client"));
    if (prismaKey) delete require.cache[prismaKey];
  } catch (e) {}
  const { PrismaClient: Client } = require("@prisma/client");
  return new Client();
}

const prisma = getJobPrisma();

function getTransporter() {
  let smtpHost = process.env.SMTP_HOST;
  let smtpPort = parseInt(process.env.SMTP_PORT || "465", 10);
  let isSecure = process.env.SMTP_SECURE === "true" || smtpPort === 465;
  let smtpUser = process.env.SMTP_USER;
  let smtpPass = process.env.SMTP_PASS;
  let fromAddress =
    process.env.SMTP_FROM || smtpUser || "Encotec Careers <jwel.inventory@tgtpartner.com>";

  if (!smtpHost || !smtpPass) {
    try {
      const fs = require("fs");
      const path = require("path");
      const envPath = path.resolve(process.cwd(), ".env");
      if (fs.existsSync(envPath)) {
        const envContent = fs.readFileSync(envPath, "utf8");
        const parseEnv = (key: string) => {
          const match = envContent.match(new RegExp(`^${key}=["']?([^"'\r\n]+)["']?`, "m"));
          return match ? match[1].trim() : undefined;
        };
        smtpHost = smtpHost || parseEnv("SMTP_HOST");
        const portVal = parseEnv("SMTP_PORT");
        if (portVal) smtpPort = parseInt(portVal, 10);
        smtpUser = smtpUser || parseEnv("SMTP_USER");
        smtpPass = smtpPass || parseEnv("SMTP_PASS");
        fromAddress = fromAddress || parseEnv("SMTP_FROM") || "Encotec Careers <jwel.inventory@tgtpartner.com>";
      }
    } catch (e) {}
  }

  if (smtpHost && smtpPass) {
    return {
      transporter: nodemailer.createTransport({
        host: smtpHost,
        port: smtpPort,
        secure: isSecure,
        auth: {
          user: smtpUser,
          pass: smtpPass,
        },
        tls: {
          rejectUnauthorized: false,
        },
      }),
      fromAddress,
    };
  }
  return null;
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, PATCH, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Requested-With",
    },
  });
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const search = searchParams.get("search") || "";
    const status = searchParams.get("status") || "";
    const skip = (page - 1) * limit;

    const where: any = {};

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
        { jobTitle: { contains: search, mode: "insensitive" } },
        { department: { contains: search, mode: "insensitive" } },
        { phone: { contains: search, mode: "insensitive" } },
      ];
    }

    if (status && status !== "ALL") {
      where.status = status;
    }

    const [applications, total] = await Promise.all([
      prisma.jobApplication.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      prisma.jobApplication.count({ where }),
    ]);

    return NextResponse.json(
      {
        success: true,
        data: applications,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit) || 1,
        },
      },
      {
        headers: {
          "Access-Control-Allow-Origin": "*",
        },
      },
    );
  } catch (error: any) {
    console.error("Job applications fetch error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Internal Server Error" },
      { status: 500, headers: { "Access-Control-Allow-Origin": "*" } },
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      name,
      email,
      phone,
      jobTitle = "General Application",
      department = "General",
      jobLocation = "India / Remote",
      experience,
      coverLetter,
      resumeName,
      resumeBase64,
      resumeUrl: clientResumeUrl,
    } = body;

    if (!name || !email) {
      return NextResponse.json(
        { success: false, error: "Candidate name and email are required" },
        { status: 400, headers: { "Access-Control-Allow-Origin": "*" } },
      );
    }

    // 1. Upload Resume PDF/Document to Cloudinary if Base64 is provided
    let finalResumeUrl = clientResumeUrl || null;
    if (resumeBase64) {
      try {
        const uploadResult = await cloudinary.uploader.upload(resumeBase64, {
          folder: "encotec-resumes",
          resource_type: "auto",
        });
        if (uploadResult && uploadResult.secure_url) {
          finalResumeUrl = uploadResult.secure_url;
        }
      } catch (cloudErr) {
        console.warn("Cloudinary upload for resume failed, falling back to database base64:", cloudErr);
      }
    }

    // 2. Save Application in Database
    const application = await prisma.jobApplication.create({
      data: {
        name,
        email,
        phone: phone || null,
        jobTitle: jobTitle || "General Application",
        department: department || "General",
        jobLocation: jobLocation || null,
        experience: experience || null,
        coverLetter: coverLetter || null,
        resumeName: resumeName || null,
        resumeUrl: finalResumeUrl,
        resumeBase64: resumeBase64 || null,
        status: "Pending",
      },
    });

    // 3. Fetch HR Email recipient (from .env or dynamic CMS page configuration)
    let hrRecipient = process.env.HR_EMAIL;
    if (!hrRecipient) {
      try {
        const careersPage = await prisma.page.findUnique({
          where: { slug: "careers" },
          include: { sections: true },
        });
        const ctaSection = careersPage?.sections.find(
          (s: any) => s.type === "CareersCTA",
        );
        if (ctaSection && typeof ctaSection.content === "object") {
          const content = ctaSection.content as any;
          if (content?.hrEmail) {
            hrRecipient = content.hrEmail;
          }
        }
      } catch (e) {}
    }

    // 4. Dispatch Email notification to HR via SMTP / Nodemailer
    let emailSent = false;
    let emailError = null;

    const smtpData = getTransporter();
    if (smtpData && hrRecipient) {
      try {
        const attachments: any[] = [];
        if (resumeBase64 && resumeName) {
          const base64Clean = resumeBase64.replace(/^data:[^;]+;base64,/, "");
          attachments.push({
            filename: resumeName,
            content: Buffer.from(base64Clean, "base64"),
          });
        }

        const htmlBody = `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; color: #222; max-width: 650px; margin: 0 auto; border: 1px solid #e5e7eb; border-radius: 12px; overflow: hidden; background-color: #ffffff;">
            <div style="background-color: #0A0F29; padding: 28px; text-align: center; border-bottom: 4px solid #a0004f;">
              <h2 style="color: #ffffff; margin: 0; font-size: 22px; text-transform: uppercase; letter-spacing: 1.5px; font-weight: 800;">New Job Application</h2>
              <p style="color: #a0004f; margin: 8px 0 0 0; font-weight: bold; font-size: 15px;">${jobTitle} (${department})</p>
            </div>
            
            <div style="padding: 28px;">
              <h3 style="margin-top: 0; color: #0A0F29; border-bottom: 2px solid #f3f4f6; padding-bottom: 10px; font-size: 16px; text-transform: uppercase; letter-spacing: 0.5px;">Candidate Information</h3>
              <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 14px;">
                <tr>
                  <td style="padding: 10px 0; width: 35%; font-weight: bold; color: #6b7280;">Full Name:</td>
                  <td style="padding: 10px 0; color: #111827; font-weight: 600;">${name}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; font-weight: bold; color: #6b7280;">Email Address:</td>
                  <td style="padding: 10px 0; color: #111827;"><a href="mailto:${email}" style="color: #a0004f; text-decoration: none; font-weight: 500;">${email}</a></td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; font-weight: bold; color: #6b7280;">Phone Number:</td>
                  <td style="padding: 10px 0; color: #111827;"><a href="tel:${phone || ""}" style="color: #111827; text-decoration: none;">${phone || "Not provided"}</a></td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; font-weight: bold; color: #6b7280;">Applied Position:</td>
                  <td style="padding: 10px 0; color: #111827; font-weight: bold;">${jobTitle}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; font-weight: bold; color: #6b7280;">Department / Location:</td>
                  <td style="padding: 10px 0; color: #111827;">${department} / ${jobLocation}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; font-weight: bold; color: #6b7280;">Experience / Current Role:</td>
                  <td style="padding: 10px 0; color: #111827;">${experience || "Not specified"}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; font-weight: bold; color: #6b7280;">Attached Resume:</td>
                  <td style="padding: 10px 0; color: #111827;">
                    ${resumeName ? `📎 <strong>${resumeName}</strong>` : "No attachment"}
                    ${finalResumeUrl ? `<br/><a href="${finalResumeUrl}" target="_blank" style="display:inline-block; margin-top:6px; font-size:12px; color:#a0004f; font-weight:bold; text-decoration:underline;">View Resume on Cloudinary</a>` : ""}
                  </td>
                </tr>
              </table>

              ${
                coverLetter
                  ? `
                <div style="background: #f9fafb; border-left: 4px solid #a0004f; padding: 16px 20px; margin: 24px 0; border-radius: 0 8px 8px 0;">
                  <strong style="display: block; margin-bottom: 6px; color: #111827; font-size: 13px; text-transform: uppercase;">Cover Note / Candidate Message:</strong>
                  <p style="margin: 0; white-space: pre-wrap; color: #374151; font-size: 14px; line-height: 1.6;">${coverLetter}</p>
                </div>
              `
                  : ""
              }

              <div style="margin-top: 30px; padding-top: 16px; border-top: 1px solid #f3f4f6; text-align: center;">
                <p style="font-size: 12px; color: #9ca3af; margin: 0;">
                  This application was submitted via the <strong>Encotec Energy Careers Portal</strong> on ${new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })} IST.
                </p>
              </div>
            </div>
          </div>
        `;

        await smtpData.transporter.sendMail({
          from: smtpData.fromAddress,
          to: hrRecipient,
          replyTo: email,
          subject: `[Job Application] ${jobTitle} - ${name}`,
          html: htmlBody,
          attachments,
        });

        emailSent = true;
      } catch (err: any) {
        console.error("Nodemailer error sending application email:", err);
        emailError = err.message;
      }
    }

    return NextResponse.json(
      {
        success: true,
        message: "Job application submitted successfully.",
        data: application,
        resumeUrl: finalResumeUrl,
        emailSent,
        hrRecipient,
        emailError: emailError || undefined,
      },
      {
        status: 201,
        headers: { "Access-Control-Allow-Origin": "*" },
      },
    );
  } catch (error: any) {
    console.error("Job application creation error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Internal Server Error" },
      { status: 500, headers: { "Access-Control-Allow-Origin": "*" } },
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, status } = body;

    if (!id || !status) {
      return NextResponse.json(
        { success: false, error: "Application ID and new status are required" },
        { status: 400 },
      );
    }

    // 1. Check if application exists
    const existing = await prisma.jobApplication.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json(
        { success: false, error: "Application not found" },
        { status: 404 },
      );
    }

    // 2. Update status in DB
    const updated = await prisma.jobApplication.update({
      where: { id },
      data: { status },
    });

    return NextResponse.json({
      success: true,
      data: updated,
    });
  } catch (error) {
    console.error("Job application status update error:", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Application ID is required" },
        { status: 400 },
      );
    }

    await prisma.jobApplication.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: "Application deleted" });
  } catch (error) {
    console.error("Job application delete error:", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
