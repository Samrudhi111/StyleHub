// ==============================================================================
// StyleHub – Experiment 5: MongoDB Setup, Collections & CRUD Operations
// Database Name: stylehub
// Can be executed in mongosh via: mongosh database/stylehub_crud.js
// Or line-by-line in mongosh interactive shell
// ==============================================================================

// ------------------------------------------------------------------------------
// 1. SWITCH TO / CREATE DATABASE
// ------------------------------------------------------------------------------
// In MongoDB, a database is created automatically when data is first inserted.
use('stylehub');

print("=================================================================");
print("Switched to database: stylehub");
print("=================================================================");

// ------------------------------------------------------------------------------
// 2. CREATE COLLECTIONS EXPLICITLY
// ------------------------------------------------------------------------------
// Drop old collections if they exist to provide a clean execution run
db.users.drop();
db.products.drop();
db.categories.drop();
db.orders.drop();

print("\nCreating collections: users, products, categories, orders...");

db.createCollection("users");
db.createCollection("products");
db.createCollection("categories");
db.createCollection("orders");

print("Collections created successfully: " + db.getCollectionNames().join(", "));

// ------------------------------------------------------------------------------
// 3. CREATE OPERATION (INSERTION)
// Demonstrates: insertOne and insertMany
// ------------------------------------------------------------------------------

print("\n-----------------------------------------------------------------");
print("CREATE OPERATIONS");
print("-----------------------------------------------------------------");

// A. Insert Categories (insertMany)
const categoriesData = [
  { categoryId: "CAT001", name: "Men", description: "Men's contemporary and formal fashion", active: true },
  { categoryId: "CAT002", name: "Women", description: "Women's modern ethnic and casual apparel", active: true },
  { categoryId: "CAT003", name: "Kids", description: "Kids' everyday wear and playwear", active: true },
  { categoryId: "CAT004", name: "Accessories", description: "Belts, watches, sunglasses, and bags", active: true }
];
const catResult = db.categories.insertMany(categoriesData);
print("Categories inserted (insertMany count): " + Object.keys(catResult.insertedIds).length);

// B. Insert Users (insertOne & insertMany)
// Demonstrate insertOne:
const adminUser = {
  name: "Samrudhi Shinde",
  email: "samrudhi@stylehub.com",
  mobile: "9876543210",
  password: "AdminHashedPassword@2026",
  role: "admin",
  createdAt: new Date("2026-10-01T09:00:00Z")
};
const userOneResult = db.users.insertOne(adminUser);
print("User inserted (insertOne id): " + userOneResult.insertedId);

// Demonstrate insertMany:
const customerUsers = [
  {
    name: "Aarav Sharma",
    email: "aarav.sharma@example.com",
    mobile: "9823456781",
    password: "CustomerPassword1#",
    role: "customer",
    createdAt: new Date("2026-10-02T10:30:00Z")
  },
  {
    name: "Priya Nair",
    email: "priya.nair@example.com",
    mobile: "9812345672",
    password: "PriyaSecurePass2$",
    role: "customer",
    createdAt: new Date("2026-10-02T11:45:00Z")
  },
  {
    name: "Rohit Verma",
    email: "rohit.verma@example.com",
    mobile: "9834567893",
    password: "RohitPass3*",
    role: "customer",
    createdAt: new Date("2026-10-03T08:15:00Z")
  }
];
const usersManyResult = db.users.insertMany(customerUsers);
print("Customers inserted (insertMany count): " + Object.keys(usersManyResult.insertedIds).length);

// C. Insert Products (insertOne & insertMany)
// Demonstrate insertOne:
const singleProduct = {
  productId: 1,
  name: "Classic Denim Jacket",
  category: "Men",
  description: "Rugged vintage-washed denim jacket crafted with premium heavy-cotton blend.",
  price: 2499,
  size: ["S", "M", "L", "XL"],
  color: "Indigo Blue",
  stock: 25,
  image: "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=600&auto=format&fit=crop&q=80",
  featured: true,
  createdAt: new Date()
};
const prodOneResult = db.products.insertOne(singleProduct);
print("Product inserted (insertOne id): " + prodOneResult.insertedId);

// Demonstrate insertMany:
const catalogProducts = [
  {
    productId: 2,
    name: "Floral Summer Dress",
    category: "Women",
    description: "Breathable chiffon floral wrap dress with waist tie and ruffled hemline.",
    price: 1899,
    size: ["XS", "S", "M", "L"],
    color: "Soft Pink Floral",
    stock: 18,
    image: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=600&auto=format&fit=crop&q=80",
    featured: true,
    createdAt: new Date()
  },
  {
    productId: 3,
    name: "Slim Fit Chinos",
    category: "Men",
    description: "Tailored stretch cotton chinos engineered for all-day comfort and mobility.",
    price: 1599,
    size: ["30", "32", "34", "36"],
    color: "Khaki Tan",
    stock: 30,
    image: "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=600&auto=format&fit=crop&q=80",
    featured: false,
    createdAt: new Date()
  },
  {
    productId: 4,
    name: "Oversized Cotton Hoodie",
    category: "Men",
    description: "Heavyweight 400 GSM fleece cotton hoodie with drop-shoulder silhouette.",
    price: 1999,
    size: ["M", "L", "XL", "XXL"],
    color: "Charcoal Heather",
    stock: 15,
    image: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=600&auto=format&fit=crop&q=80",
    featured: true,
    createdAt: new Date()
  },
  {
    productId: 5,
    name: "High-Waist Wide Leg Trousers",
    category: "Women",
    description: "Contemporary pleated wide-leg trousers tailored with premium viscose blend.",
    price: 2199,
    size: ["S", "M", "L"],
    color: "Jet Black",
    stock: 22,
    image: "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=600&auto=format&fit=crop&q=80",
    featured: false,
    createdAt: new Date()
  },
  {
    productId: 6,
    name: "Kids Dino Graphic T-Shirt",
    category: "Kids",
    description: "100% bio-washed organic cotton crew neck t-shirt with playful glow print.",
    price: 699,
    size: ["4-5Y", "6-7Y", "8-9Y"],
    color: "Olive Green",
    stock: 40,
    image: "https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=600&auto=format&fit=crop&q=80",
    featured: false,
    createdAt: new Date()
  },
  {
    productId: 7,
    name: "Italian Leather Reversible Belt",
    category: "Accessories",
    description: "Genuine full-grain Italian leather belt featuring a 360-degree rotating buckle.",
    price: 1299,
    size: ["Free Size"],
    color: "Black / Brown",
    stock: 50,
    image: "https://images.unsplash.com/photo-1624222247344-550fb60583dc?w=600&auto=format&fit=crop&q=80",
    featured: true,
    createdAt: new Date()
  },
  {
    productId: 8,
    name: "Temporary Clearance Stock Item",
    category: "Accessories",
    description: "Sample clearance accessory to demonstrate delete operations.",
    price: 499,
    size: ["Free Size"],
    color: "Red",
    stock: 5,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80",
    featured: false,
    createdAt: new Date()
  }
];
const prodsManyResult = db.products.insertMany(catalogProducts);
print("Catalog products inserted (insertMany count): " + Object.keys(prodsManyResult.insertedIds).length);

// D. Insert Orders (insertOne & insertMany)
const order1 = {
  orderId: "ORD-2026-1001",
  userId: customerUsers[0].email,
  products: [
    { productId: 1, name: "Classic Denim Jacket", size: "L", quantity: 1, unitPrice: 2499 },
    { productId: 3, name: "Slim Fit Chinos", size: "32", quantity: 1, unitPrice: 1599 }
  ],
  totalAmount: 4098,
  orderDate: new Date("2026-10-02T14:20:00Z"),
  status: "Delivered",
  shippingAddress: {
    street: "42 Park Avenue, Bandra West",
    city: "Mumbai",
    state: "Maharashtra",
    pincode: "400050"
  }
};
db.orders.insertOne(order1);

const ordersMany = [
  {
    orderId: "ORD-2026-1002",
    userId: customerUsers[1].email,
    products: [
      { productId: 2, name: "Floral Summer Dress", size: "M", quantity: 2, unitPrice: 1899 }
    ],
    totalAmount: 3798,
    orderDate: new Date("2026-10-02T16:10:00Z"),
    status: "Processing",
    shippingAddress: {
      street: "18 MG Road, Indiranagar",
      city: "Bengaluru",
      state: "Karnataka",
      pincode: "560038"
    }
  },
  {
    orderId: "ORD-2026-1003",
    userId: customerUsers[2].email,
    products: [
      { productId: 4, name: "Oversized Cotton Hoodie", size: "XL", quantity: 1, unitPrice: 1999 },
      { productId: 7, name: "Italian Leather Reversible Belt", size: "Free Size", quantity: 1, unitPrice: 1299 }
    ],
    totalAmount: 3298,
    orderDate: new Date("2026-10-03T07:15:00Z"),
    status: "Shipped",
    shippingAddress: {
      street: "104 Civil Lines",
      city: "Jaipur",
      state: "Rajasthan",
      pincode: "302006"
    }
  }
];
db.orders.insertMany(ordersMany);
print("Orders collection initialized with sample order documents.");

// ------------------------------------------------------------------------------
// 4. READ OPERATION (QUERYING & PROJECTION)
// Demonstrates: find, findOne, projection, filters, sorting
// ------------------------------------------------------------------------------

print("\n-----------------------------------------------------------------");
print("READ OPERATIONS");
print("-----------------------------------------------------------------");

// A. findOne - Find a single user by email
print("\n--- A. findOne: Search user by email ---");
const foundUser = db.users.findOne({ email: "priya.nair@example.com" }, { password: 0 });
printjson(foundUser);

// B. findOne - Find a single product by productId
print("\n--- B. findOne: Search product by productId ---");
const foundProduct = db.products.findOne({ productId: 1 });
printjson(foundProduct);

// C. find - Find all products in category 'Men'
print("\n--- C. find: All Men category products (with projection) ---");
const menProducts = db.products.find(
  { category: "Men" },
  { name: 1, price: 1, stock: 1, _id: 0 }
).toArray();
printjson(menProducts);

// D. find - Find products with price greater than or equal to 2000
print("\n--- D. find: Products with price >= 2000 ($gte filter) ---");
const premiumProducts = db.products.find(
  { price: { $gte: 2000 } },
  { name: 1, price: 1, category: 1 }
).sort({ price: -1 }).toArray();
printjson(premiumProducts);

// E. find - Display all orders
print("\n--- E. find: All orders summary ---");
const allOrders = db.orders.find({}, { orderId: 1, userId: 1, totalAmount: 1, status: 1, _id: 0 }).toArray();
printjson(allOrders);

// ------------------------------------------------------------------------------
// 5. UPDATE OPERATION
// Demonstrates: updateOne and updateMany ($set, $inc, $currentDate)
// ------------------------------------------------------------------------------

print("\n-----------------------------------------------------------------");
print("UPDATE OPERATIONS");
print("-----------------------------------------------------------------");

// A. updateOne: Update product price and stock for 'Classic Denim Jacket' (productId: 1)
print("\n--- A. updateOne: Update price from 2499 to 2299 and stock from 25 to 35 for productId: 1 ---");
const updateOneResult = db.products.updateOne(
  { productId: 1 },
  {
    $set: {
      price: 2299,
      stock: 35,
      updatedAt: new Date()
    }
  }
);
print("Matched Count: " + updateOneResult.matchedCount + ", Modified Count: " + updateOneResult.modifiedCount);

// Verify the update:
const verifiedUpdatedProduct = db.products.findOne(
  { productId: 1 },
  { productId: 1, name: 1, price: 1, stock: 1, updatedAt: 1, _id: 0 }
);
print("Verified Product Document after updateOne:");
printjson(verifiedUpdatedProduct);

// B. updateMany: Apply a 10% discount ($mul) or promotional tag ($set) to all Women category items
print("\n--- B. updateMany: Add onSale flag and decrease stock by 1 for all Women products ---");
const updateManyResult = db.products.updateMany(
  { category: "Women" },
  {
    $set: { onSale: true },
    $inc: { stock: -1 } // Decrement stock by 1 using $inc
  }
);
print("Matched Count: " + updateManyResult.matchedCount + ", Modified Count: " + updateManyResult.modifiedCount);

// Verify updateMany:
const updatedWomenProducts = db.products.find(
  { category: "Women" },
  { name: 1, price: 1, stock: 1, onSale: 1, _id: 0 }
).toArray();
printjson(updatedWomenProducts);

// ------------------------------------------------------------------------------
// 6. DELETE OPERATION
// Demonstrates: deleteOne and deleteMany
// ------------------------------------------------------------------------------

print("\n-----------------------------------------------------------------");
print("DELETE OPERATIONS");
print("-----------------------------------------------------------------");

// A. deleteOne: Delete clearance product with productId: 8
print("\n--- A. deleteOne: Delete product with productId: 8 ---");
const deleteOneResult = db.products.deleteOne({ productId: 8 });
print("Deleted Count: " + deleteOneResult.deletedCount);

// Verify deletion:
const checkDeleted = db.products.findOne({ productId: 8 });
print("Verification of deleted product (should be null): " + checkDeleted);

// B. deleteMany: Delete all products with stock <= 0 (if any) or test condition
print("\n--- B. deleteMany: Clean up any discontinued or zero-stock products ---");
const deleteManyResult = db.products.deleteMany({ stock: { $lte: 0 } });
print("Deleted Count with stock <= 0: " + deleteManyResult.deletedCount);

// ------------------------------------------------------------------------------
// 7. SUMMARY & COLLECTION STATS
// ------------------------------------------------------------------------------
print("\n=================================================================");
print("FINAL DATABASE SUMMARY FOR 'stylehub'");
print("=================================================================");
print("Total Users in DB:       " + db.users.countDocuments());
print("Total Products in DB:    " + db.products.countDocuments());
print("Total Categories in DB:  " + db.categories.countDocuments());
print("Total Orders in DB:      " + db.orders.countDocuments());
print("=================================================================");
print("All CRUD Operations Completed Successfully in MongoDB!");
