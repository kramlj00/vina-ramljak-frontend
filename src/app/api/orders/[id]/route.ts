import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * GET /api/orders/[id]
 * Get single order by ID
 */
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    // TODO: Add authentication check
    // const session = await getServerSession();
    // if (!session) {
    //   return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    // }

    const order = await prisma.order.findUnique({
      where: { id },
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // TODO: Check if user owns this order or is admin
    // if (order.customerEmail !== session.user.email && !session.user.isAdmin) {
    //   return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    // }

    return NextResponse.json({ order });
  } catch (error) {
    console.error("Error fetching order:", error);
    return NextResponse.json(
      { error: "Failed to fetch order" },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/orders/[id]
 * Update order status (admin only)
 */
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await req.json();
    const { status, notes } = body;

    // TODO: Add admin authentication check
    // const session = await getServerSession();
    // if (!session || !session.user.isAdmin) {
    //   return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    // }

    const order = await prisma.order.update({
      where: { id },
      data: {
        ...(status && { status }),
        ...(notes !== undefined && { notes }),
        updatedAt: new Date(),
      },
    });

    return NextResponse.json({ order });
  } catch (error) {
    console.error("Error updating order:", error);
    return NextResponse.json(
      { error: "Failed to update order" },
      { status: 500 }
    );
  }
}
