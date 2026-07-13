import User from "../src/models/user.model.js";

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
