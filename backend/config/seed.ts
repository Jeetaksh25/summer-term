import User from "../src/models/user.model.js";
import { Table } from "../src/models/table.model.js";

export async function seedAdmin() {
  const email = "admin@dineflow.app";
  const exists = await User.findOne({ email });
  if (exists) return;

  await User.create({
    email,
    password: "admin123",
    name: "Admin User",
    role: "admin",
  });

  console.log(`Seeded admin: ${email} / admin123`);
}

export async function migrateTables() {
  const tables = await Table.find({ "capactiy": { $exists: true } } as any);
  for (const table of tables) {
    const raw = table.toObject() as Record<string, any>;
    const cap = raw.capactiy;
    if (cap !== undefined) {
      await Table.updateOne(
        { _id: table._id },
        { $set: { capacity: cap }, $unset: { capactiy: "" } } as any
      );
    }
  }
  if (tables.length > 0) {
    console.log(`Migrated ${tables.length} table(s) from capactiy to capacity`);
  }
}
