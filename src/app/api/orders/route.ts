import { NextRequest, NextResponse } from "next/server";
import { getAllOrders } from "@/lib/db/orders";

/**
 * GET /api/orders
 * Get all orders (admin endpoint)
 *
 * Query params:
 * - limit: number (default: 50)
 * - offset: number (default: 0)
 * - status: string (optional)
 */
export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const limit = parseInt(searchParams.get("limit") || "50");
    const offset = parseInt(searchParams.get("offset") || "0");
    const status = searchParams.get("status") || undefined;

    // TODO: Add authentication check
    // const session = await getServerSession();
    // if (!session || !session.user.isAdmin) {
    //   return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    // }

    const { orders, total } = await getAllOrders({ limit, offset, status });

    return NextResponse.json({
      orders,
      total,
      limit,
      offset,
      hasMore: offset + orders.length < total,
    });
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}
