import { NextRequest, NextResponse } from "next/server";
import {
  NotificationService,
  NotificationType,
  NotificationChannel,
} from "@/lib/notification-service";
import { prisma } from "@/lib/prisma";
import {
  NOTIFICATION_TEMPLATES,
  getTemplateById,
  getTemplatesByCategory,
  getAllCategories
} from "@/lib/notification-templates";

// GET /api/notifications/templates - Get notification templates
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type");
    const isActive = searchParams.get("isActive");
    const source = searchParams.get("source"); // 'predefined' or 'database'
    const category = searchParams.get("category");
    const search = searchParams.get("search");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");

    // If requesting predefined templates
    if (source === "predefined") {
      let templates = NOTIFICATION_TEMPLATES;

      // Filter by category
      if (category) {
        templates = getTemplatesByCategory(category);
      }

      // Filter by search
      if (search) {
        templates = templates.filter(template =>
          template.name.toLowerCase().includes(search.toLowerCase()) ||
          template.description.toLowerCase().includes(search.toLowerCase())
        );
      }

      // Pagination
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedTemplates = templates.slice(startIndex, endIndex);

      return NextResponse.json({
        success: true,
        templates: paginatedTemplates,
        total: templates.length,
        page,
        limit,
        categories: getAllCategories(),
      });
    }

    // Get database templates
    const where: any = {};
    // Note: database NotificationTemplate model doesn't have 'type' field
    // if (type) where.type = type;
    if (isActive !== null) where.isActive = isActive === "true";

    const templates = await prisma.notificationTemplate.findMany({
      where,
      include: {
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({
      success: true,
      templates,
    });
  } catch (error) {
    console.error("Error getting notification templates:", error);
    return NextResponse.json(
      { success: false, message: "Failed to get notification templates" },
      { status: 500 },
    );
  }
}

// POST /api/notifications/templates - Create notification template
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      name,
      title,
      message,
      type,
      channels = [NotificationChannel.IN_APP],
      variables,
      createdBy,
    } = body;

    // Validation
    if (!name || !title || !message || !type || !createdBy) {
      return NextResponse.json(
        {
          success: false,
          message: "Name, title, message, type, and createdBy are required",
        },
        { status: 400 },
      );
    }

    if (!Object.values(NotificationType).includes(type)) {
      return NextResponse.json(
        { success: false, message: "Invalid notification type" },
        { status: 400 },
      );
    }

    const template = await NotificationService.createTemplate({
      name,
      title,
      message,
      type,
      channels,
      variables,
      createdBy,
    });

    return NextResponse.json({
      success: true,
      message: "Notification template created successfully",
      template,
    });
  } catch (error) {
    console.error("Error creating notification template:", error);
    return NextResponse.json(
      { success: false, message: "Failed to create notification template" },
      { status: 500 },
    );
  }
}

// PUT /api/notifications/templates - Update notification template
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, name, title, message, type, channels, variables, isActive } =
      body;

    if (!id) {
      return NextResponse.json(
        { success: false, message: "Template ID is required" },
        { status: 400 },
      );
    }

    const updateData: any = {};
    if (name !== undefined) updateData.name = name;
    if (title !== undefined) updateData.title = title;
    if (message !== undefined) {
      updateData.message = message;
      updateData.content = message; // For backward compatibility
    }
    if (type !== undefined) updateData.type = type;
    if (channels !== undefined) updateData.channels = channels.join(",");
    if (variables !== undefined)
      updateData.variables = JSON.stringify(variables);
    if (isActive !== undefined) updateData.isActive = isActive;

    const template = await prisma.notificationTemplate.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({
      success: true,
      message: "Notification template updated successfully",
      template,
    });
  } catch (error) {
    console.error("Error updating notification template:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update notification template" },
      { status: 500 },
    );
  }
}

// DELETE /api/notifications/templates - Delete notification template
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, message: "Template ID is required" },
        { status: 400 },
      );
    }

    await prisma.notificationTemplate.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: "Notification template deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting notification template:", error);
    return NextResponse.json(
      { success: false, message: "Failed to delete notification template" },
      { status: 500 },
    );
  }
}
