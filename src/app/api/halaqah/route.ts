import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth, ApiResponse } from "@/lib/auth-middleware";
import { hasPermission } from "@/lib/permissions";

// GET /api/halaqah - Get halaqah based on user permissions
export async function GET(request: NextRequest) {
  try {
    console.log("GET /api/halaqah - Starting request");

    // Check authentication
    const authResult = await requireAuth(request);
    if (authResult instanceof NextResponse) {
      return authResult;
    }

    const { searchParams } = new URL(request.url);
    const musyrifId = searchParams.get("musyrifId");
    const level = searchParams.get("level");
    const search = searchParams.get("search");
    const type = searchParams.get("type");

    console.log("Query parameters:", { musyrifId, level, search, type });
    console.log("User role:", authResult.role, "User ID:", authResult.id);

    const where: any = {};

    // Apply role-based filtering
    if (authResult.role === 'MUSYRIF') {
      // Musyrif can only see their own halaqah
      where.musyrifId = authResult.id;
      console.log("Musyrif access: filtering by musyrifId =", authResult.id);
    } else if (authResult.role === 'ADMIN') {
      // Admin can see all halaqah, apply requested filters
      if (musyrifId && musyrifId !== "ALL") {
        where.musyrifId = musyrifId;
      }
    } else {
      // Other roles have limited access
      return ApiResponse.forbidden("Access denied to halaqah data");
    }

    if (level && level !== "ALL") {
      where.level = level;
    }

    // Note: type field doesn't exist in current schema, skipping type filter

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ];
    }

    console.log("Final where clause:", JSON.stringify(where));

    console.log("Executing simplified Prisma query...");

    // Use simplified query to avoid complex relation issues
    const halaqah = await prisma.halaqah.findMany({
      where,
      select: {
        id: true,
        name: true,
        description: true,
        level: true,
        capacity: true,
        status: true,
        createdAt: true,
        updatedAt: true,
        musyrifId: true,
      },
      orderBy: {
        name: "asc",
      },
    });

    console.log(`Query successful, found ${halaqah.length} halaqah records`);

    return NextResponse.json({
      success: true,
      halaqah,
      total: halaqah.length,
    });
  } catch (error) {
    console.error("Error fetching halaqah:", error);

    // Return a more detailed error message
    return NextResponse.json(
      {
        success: false,
        message: "Gagal mengambil data halaqah",
        error: error instanceof Error ? error.message : "Unknown error",
        stack:
          process.env.NODE_ENV !== "production" && error instanceof Error
            ? error.stack
            : undefined,
      },
      { status: 500 },
    );
  }
}

// POST /api/halaqah - Create new halaqah (Admin only)
export async function POST(request: NextRequest) {
  try {
    // Check authentication and permission
    const authResult = await requireAuth(request);
    if (authResult instanceof NextResponse) {
      return authResult;
    }

    // Only admin can create halaqah
    if (!hasPermission(authResult.role, 'halaqah:create')) {
      return ApiResponse.forbidden("Only admin can create new halaqah");
    }

    const body = await request.json();
    const {
      name,
      description,
      level,
      capacity,
      musyrifId,
      schedules = [],
    } = body;

    // Validation
    if (!name || !level || !musyrifId) {
      return NextResponse.json(
        { success: false, message: "Nama, level, dan musyrif wajib diisi" },
        { status: 400 },
      );
    }

    console.log("Received musyrifId:", musyrifId); // Add this log

    // Check if musyrif exists
    const musyrif = await prisma.musyrif.findUnique({
      where: { id: musyrifId },
    });

    console.log("Musyrif found:", musyrif); // Add this log

    if (!musyrif) {
      return NextResponse.json(
        { success: false, message: "Musyrif tidak ditemukan" },
        { status: 400 },
      );
    }

    // Check if halaqah name already exists
    const existingHalaqah = await prisma.halaqah.findFirst({
      where: { name },
    });

    if (existingHalaqah) {
      return NextResponse.json(
        { success: false, message: "Nama halaqah sudah digunakan" },
        { status: 400 },
      );
    }

    // Create halaqah with schedules
    // Prepare data object with required fields
    const halaqahData: any = {
      name,
      description: description || "",
      level,
      capacity: capacity || 20,
      musyrifId,
      schedules: {
        create: schedules.map((schedule: any) => ({
          dayOfWeek: schedule.dayOfWeek,
          startTime: schedule.startTime,
          endTime: schedule.endTime,
          room: schedule.room || "",
        })),
      },
    };

    // Note: type field doesn't exist in current schema, skipping

    const halaqah = await prisma.halaqah.create({
      data: halaqahData,
      include: {
        musyrif: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
        schedules: true,
        _count: {
          select: {
            santri: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      message: "Halaqah berhasil dibuat",
      halaqah,
    });
  } catch (error) {
    console.error("Error creating halaqah:", error);
    return NextResponse.json(
      { success: false, message: "Gagal membuat halaqah" },
      { status: 500 },
    );
  }
}
