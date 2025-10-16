export async function POST(req: Request) {
  await connectDB();
  try {
    const data = await req.json();

    if (!data.branch || !mongoose.Types.ObjectId.isValid(data.branch))
      throw new Error("Valid branch is required");

    if (!data.items || !Array.isArray(data.items) || data.items.length === 0)
      throw new Error("At least one product is required");

    // Validate each item
    data.items.forEach((item: any) => {
      if (!item.product || !mongoose.Types.ObjectId.isValid(item.product))
        throw new Error("Valid product is required");
      if (!item.quantity || item.quantity <= 0) throw new Error("Quantity must be > 0");
      if (!item.total || item.total <= 0) throw new Error("Total is required");
    });

    const sale = await Sale.create({
      branch: new mongoose.Types.ObjectId(data.branch),
      items: data.items.map((item: any) => ({
        product: new mongoose.Types.ObjectId(item.product),
        quantity: item.quantity,
        price: item.price,
        total: item.total,
      })),
      subtotal: data.subtotal,
      discount: data.discount,
      discountType: data.discountType,
      tax: data.tax,
      total: data.total,
      date: data.date || new Date(),
    });

    const populatedSale = await Sale.findById(sale._id)
      .populate("branch", "name")
      .populate("items.product", "name price");

    return NextResponse.json(populatedSale, { status: 201 });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
