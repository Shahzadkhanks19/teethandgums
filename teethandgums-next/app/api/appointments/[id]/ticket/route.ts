import mongoose from "mongoose";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Appointment from "@/lib/models/Appointment";
import { verifyAppointmentTicketToken } from "@/lib/appointmentTicket";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const escapeHtml = (value: unknown) => String(value ?? "").replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char] || char);

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const token = req.nextUrl.searchParams.get("token") || "";
  if (!mongoose.isValidObjectId(id) || !verifyAppointmentTicketToken(id, token)) return new NextResponse("Invalid or expired ticket link", { status: 403 });
  await connectDB();
  const appointment = await Appointment.findById(id).lean();
  if (!appointment) return new NextResponse("Appointment not found", { status: 404 });
  const rows = [["Ticket ID", id], ["Patient", appointment.name], ["Status", appointment.status], ["Service", appointment.service], ["Doctor", appointment.doctor], ["Date", appointment.date], ["Time", appointment.timeSlot], ["Phone", appointment.phone], ["Email", appointment.email]];
  const html = `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>Appointment Ticket</title><style>body{font-family:Arial,sans-serif;background:#eef4ff;margin:0;padding:32px;color:#0f172a}.ticket{max-width:760px;margin:auto;background:white;border:1px solid #dbeafe;border-radius:24px;overflow:hidden;box-shadow:0 20px 60px #1d4ed820}.head{padding:28px;background:linear-gradient(135deg,#2563eb,#172554);color:white}.body{padding:28px}.row{display:grid;grid-template-columns:180px 1fr;padding:13px 0;border-bottom:1px solid #e2e8f0}.label{font-weight:700;color:#475569}.note{margin-top:24px;padding:18px;border-radius:14px;background:#eff6ff}.actions{text-align:center;margin-top:24px}button{padding:12px 22px;border:0;border-radius:10px;background:#2563eb;color:white;font-weight:700}@media(max-width:600px){body{padding:12px}.row{grid-template-columns:1fr;gap:5px}}</style></head><body><main class="ticket"><header class="head"><h1>Teeth &amp; Gums Care</h1><p>Official Appointment Ticket</p></header><section class="body">${rows.map(([label,value])=>`<div class="row"><div class="label">${escapeHtml(label)}</div><div>${escapeHtml(value)}</div></div>`).join("")}<div class="note">Please arrive 10 minutes early. This ticket is linked to the latest appointment status in our system.</div><div class="actions"><button onclick="window.print()">Print / Save as PDF</button></div></section></main></body></html>`;
  return new NextResponse(html, { headers: { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "private, no-store", "X-Robots-Tag": "noindex, nofollow" } });
}
