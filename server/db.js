import fs from 'node:fs';
import { DatabaseSync } from 'node:sqlite';
import { ADMIN_EMAIL, ADMIN_PASSWORD, DATA_DIR, DB_PATH, SESSION_TTL_MS } from './config.js';
import { createSalt, createToken, hashPassword, verifyPassword } from './auth.js';

export { createSalt, createToken, hashPassword, verifyPassword };

fs.mkdirSync(DATA_DIR, { recursive: true });

const db = new DatabaseSync(DB_PATH);
db.exec('PRAGMA foreign_keys = ON;');

db.exec(`
  CREATE TABLE IF NOT EXISTS admins (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    password_hash TEXT NOT NULL,
    password_salt TEXT NOT NULL,
    created_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS admin_sessions (
    token TEXT PRIMARY KEY,
    admin_id INTEGER NOT NULL,
    expires_at TEXT NOT NULL,
    created_at TEXT NOT NULL,
    FOREIGN KEY (admin_id) REFERENCES admins(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS customers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    phone TEXT,
    password_hash TEXT NOT NULL,
    password_salt TEXT NOT NULL,
    created_at TEXT NOT NULL
  );
  CREATE TABLE IF NOT EXISTS pending_verifications (
    email TEXT PRIMARY KEY,
    type TEXT NOT NULL, -- 'signup' or 'login'
    payload TEXT NOT NULL, -- JSON data
    otp_code TEXT NOT NULL,
    expires_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS customer_sessions (
    token TEXT PRIMARY KEY,
    customer_id INTEGER NOT NULL,
    expires_at TEXT NOT NULL,
    created_at TEXT NOT NULL,
    FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    order_id TEXT NOT NULL UNIQUE,
    order_number TEXT NOT NULL UNIQUE,
    tracking_number TEXT NOT NULL UNIQUE,
    access_key TEXT NOT NULL UNIQUE,
    customer_id INTEGER, -- Optional: link to account
    customer_name TEXT NOT NULL,
    customer_email TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    shipping_address TEXT NOT NULL,
    city TEXT NOT NULL,
    state TEXT NOT NULL,
    zip_code TEXT NOT NULL,
    subtotal REAL NOT NULL,
    tax REAL NOT NULL,
    delivery_charge REAL NOT NULL,
    total REAL NOT NULL,
    payment_method TEXT NOT NULL,
    last_four TEXT, -- Last 4 digits for billing reference
    status TEXT NOT NULL,
    created_at TEXT NOT NULL,
    estimated_delivery TEXT NOT NULL,
    FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE SET NULL
  );

  CREATE TABLE IF NOT EXISTS order_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    order_id INTEGER NOT NULL,
    product_id TEXT NOT NULL,
    product_name TEXT NOT NULL,
    product_price REAL NOT NULL,
    product_category TEXT NOT NULL,
    product_image TEXT NOT NULL,
    product_description TEXT NOT NULL,
    quantity INTEGER NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS notifications (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    customer_id INTEGER NOT NULL,
    order_number TEXT NOT NULL,
    type TEXT NOT NULL, -- 'shipped', 'cancelled', 'processing'
    message TEXT NOT NULL,
    is_read INTEGER DEFAULT 0,
    created_at TEXT NOT NULL,
    FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE
  );
`);

// Support Migrations for existing DB
try { db.exec('ALTER TABLE orders ADD COLUMN customer_id INTEGER;'); } catch (e) {}
try { db.exec('ALTER TABLE orders ADD COLUMN last_four TEXT;'); } catch (e) {}
try { db.exec('ALTER TABLE customers ADD COLUMN email_notifications INTEGER DEFAULT 1;'); } catch (e) {}
try { db.exec('ALTER TABLE customers ADD COLUMN reset_token TEXT;'); } catch (e) {}
try { db.exec('ALTER TABLE customers ADD COLUMN reset_expires TEXT;'); } catch (e) {}
try { db.exec('ALTER TABLE customers ADD COLUMN is_verified INTEGER DEFAULT 0;'); } catch (e) {}
try { db.exec('ALTER TABLE customers ADD COLUMN otp_code TEXT;'); } catch (e) {}
try { db.exec('ALTER TABLE customers ADD COLUMN otp_expires TEXT;'); } catch (e) {}
try { db.exec('ALTER TABLE customers ADD COLUMN deletion_requested INTEGER DEFAULT 0;'); } catch (e) {}

// For existing users, force them to be verified so they aren't locked out due to previous incomplete flows
try { db.exec('UPDATE customers SET is_verified = 1 WHERE is_verified = 0;'); } catch (e) {}

const insertAdminStatement = db.prepare(`
  INSERT INTO admins (email, name, password_hash, password_salt, created_at)
  VALUES (?, ?, ?, ?, ?)
`);

const selectAdminByEmailStatement = db.prepare(`
  SELECT id, email, name, password_hash, password_salt
  FROM admins
  WHERE lower(email) = lower(?)
`);

const insertSessionStatement = db.prepare(`
  INSERT INTO admin_sessions (token, admin_id, expires_at, created_at)
  VALUES (?, ?, ?, ?)
`);

const selectSessionStatement = db.prepare(`
  SELECT
    admin_sessions.token,
    admin_sessions.expires_at,
    admins.id AS admin_id,
    admins.email AS admin_email,
    admins.name AS admin_name
  FROM admin_sessions
  INNER JOIN admins ON admins.id = admin_sessions.admin_id
  WHERE admin_sessions.token = ?
`);

const deleteSessionStatement = db.prepare(`DELETE FROM admin_sessions WHERE token = ?`);
const cleanupSessionsStatement = db.prepare(`DELETE FROM admin_sessions WHERE expires_at <= ?`);

const insertOrderStatement = db.prepare(`
  INSERT INTO orders (
    order_id,
    order_number,
    tracking_number,
    access_key,
    customer_id,
    customer_name,
    customer_email,
    customer_phone,
    shipping_address,
    city,
    state,
    zip_code,
    subtotal,
    tax,
    delivery_charge,
    total,
    payment_method,
    last_four,
    status,
    created_at,
    estimated_delivery
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`);

const insertOrderItemStatement = db.prepare(`
  INSERT INTO order_items (
    order_id,
    product_id,
    product_name,
    product_price,
    product_category,
    product_image,
    product_description,
    quantity
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
`);

const selectAllOrdersStatement = db.prepare(`
  SELECT *
  FROM orders
  ORDER BY datetime(created_at) DESC
`);

const selectOrderByNumberStatement = db.prepare(`
  SELECT *
  FROM orders
  WHERE order_number = ?
`);

const selectOrdersByReferencesStatement = db.prepare(`
  SELECT *
  FROM orders
  WHERE order_number = ? AND access_key = ?
`);

const selectOrderItemsStatement = db.prepare(`
  SELECT *
  FROM order_items
  WHERE order_id = ?
  ORDER BY id ASC
`);

const updateOrderStatusStatement = db.prepare(`
  UPDATE orders
  SET status = ?
  WHERE order_number = ?
`);

const insertCustomerStatement = db.prepare(`
  INSERT INTO customers (email, name, phone, password_hash, password_salt, is_verified, created_at)
  VALUES (?, ?, ?, ?, ?, 1, ?)
`);

const updateCustomerSettingsStatement = db.prepare(`
  UPDATE customers SET name = ?, phone = ?, email_notifications = ? WHERE id = ?
`);

const updateCustomerPasswordStatement = db.prepare(`
  UPDATE customers SET password_hash = ?, password_salt = ? WHERE id = ?
`);

const selectCustomerByEmailStatement = db.prepare(`
  SELECT * FROM customers WHERE lower(email) = lower(?)
`);

const selectCustomerByIdStatement = db.prepare(`
  SELECT * FROM customers WHERE id = ?
`);

const updateCustomerProfileStatement = db.prepare(`
  UPDATE customers
  SET name = ?, phone = ?
  WHERE id = ?
`);

const deleteCustomerStatement = db.prepare(`
  DELETE FROM customers WHERE id = ?
`);

const setCustomerResetTokenStatement = db.prepare(`
  UPDATE customers SET reset_token = ?, reset_expires = ? WHERE id = ?
`);

const findCustomerByResetTokenStatement = db.prepare(`
  SELECT * FROM customers WHERE reset_token = ? AND reset_expires > ?
`);

const insertCustomerSessionStatement = db.prepare(`
  INSERT INTO customer_sessions (token, customer_id, expires_at, created_at)
  VALUES (?, ?, ?, ?)
`);

const selectCustomerSessionStatement = db.prepare(`
  SELECT
    customer_sessions.token,
    customer_sessions.expires_at,
    customers.id,
    customers.email,
    customers.name,
    customers.phone,
    customers.email_notifications
  FROM customer_sessions
  INNER JOIN customers ON customers.id = customer_sessions.customer_id
  WHERE customer_sessions.token = ?
`);

const deleteCustomerSessionStatement = db.prepare(`DELETE FROM customer_sessions WHERE token = ?`);
const cleanupCustomerSessionsStatement = db.prepare(`DELETE FROM customer_sessions WHERE expires_at <= ?`);

const selectOrdersByCustomerIdStatement = db.prepare(`
  SELECT * FROM orders WHERE customer_id = ? ORDER BY datetime(created_at) DESC
`);

const insertNotificationStatement = db.prepare(`
  INSERT INTO notifications (customer_id, order_number, type, message, created_at)
  VALUES (?, ?, ?, ?, ?)
`);

const selectNotificationsByCustomerIdStatement = db.prepare(`
  SELECT * FROM notifications WHERE customer_id = ? ORDER BY datetime(created_at) DESC
`);

const markNotificationReadStatement = db.prepare(`
  UPDATE notifications SET is_read = 1 WHERE id = ? AND customer_id = ?
`);


const seedAdmin = () => {
  const salt = createSalt();
  const passwordHash = hashPassword(ADMIN_PASSWORD, salt);

  const existingAdmin = selectAdminByEmailStatement.get(ADMIN_EMAIL);
  if (existingAdmin) {
    // Force update the password to match config.js
    db.prepare('UPDATE admins SET password_hash = ?, password_salt = ? WHERE id = ?').run(
      passwordHash,
      salt,
      existingAdmin.id
    );
    console.log(`🔐 Admin password synchronized for ${ADMIN_EMAIL}`);
    return;
  }

  insertAdminStatement.run(
    ADMIN_EMAIL,
    'IGO Admin',
    passwordHash,
    salt,
    new Date().toISOString(),
  );
  console.log(`✅ Admin account created with password from config.js`);
};

seedAdmin();

const mapOrderItems = (rows) =>
  rows.map((item) => ({
    product: {
      id: item.product_id,
      name: item.product_name,
      price: item.product_price,
      category: item.product_category,
      image: item.product_image,
      description: item.product_description,
    },
    quantity: item.quantity,
  }));

const hydrateOrder = (row) => {
  if (!row) {
    return null;
  }

  const itemRows = selectOrderItemsStatement.all(row.id);
  return {
    id: row.order_id,
    orderNumber: row.order_number,
    trackingNumber: row.tracking_number,
    customerName: row.customer_name,
    customerEmail: row.customer_email,
    customerPhone: row.customer_phone,
    shippingAddress: row.shipping_address,
    city: row.city,
    state: row.state,
    zipCode: row.zip_code,
    customerId: row.customer_id,
    deletionRequested: row.customer_id ? (db.prepare('SELECT deletion_requested FROM customers WHERE id = ?').get(row.customer_id)?.deletion_requested === 1) : false,
    items: mapOrderItems(itemRows),
    subtotal: row.subtotal,
    tax: row.tax,
    deliveryCharge: row.delivery_charge,
    total: row.total,
    paymentMethod: row.payment_method,
    status: row.status,
    createdAt: row.created_at,
    estimatedDelivery: row.estimated_delivery,
  };
};

const hydrateNotification = (row) => {
  if (!row) return null;
  return {
    id: row.id,
    customerId: row.customer_id,
    orderNumber: row.order_number,
    type: row.type,
    message: row.message,
    isRead: row.is_read === 1,
    createdAt: row.created_at,
  };
};

export const createAdminSession = ({ email, password }) => {
  cleanupSessionsStatement.run(new Date().toISOString());
  const admin = selectAdminByEmailStatement.get(email);

  if (!admin || !verifyPassword(password, admin.password_salt, admin.password_hash)) {
    return null;
  }

  const token = createToken(32);
  const createdAt = new Date();
  const expiresAt = new Date(createdAt.getTime() + SESSION_TTL_MS).toISOString();

  insertSessionStatement.run(token, admin.id, expiresAt, createdAt.toISOString());

  return {
    token,
    admin: {
      id: admin.id,
      email: admin.email,
      name: admin.name,
    },
  };
};

export const getAdminSession = (token) => {
  if (!token) {
    return null;
  }

  cleanupSessionsStatement.run(new Date().toISOString());
  const session = selectSessionStatement.get(token);
  if (!session) {
    return null;
  }

  return {
    token: session.token,
    admin: {
      id: session.admin_id,
      email: session.admin_email,
      name: session.admin_name,
    },
  };
};

export const deleteAdminSession = (token) => {
  deleteSessionStatement.run(token);
};

export const createOrder = (payload) => {
  const createdAt = new Date().toISOString();
  db.exec('BEGIN');
  try {
    insertOrderStatement.run(
      payload.id,
      payload.orderNumber,
      payload.trackingNumber,
      payload.accessKey,
      payload.customerId || null,
      payload.customerName,
      payload.customerEmail,
      payload.customerPhone,
      payload.shippingAddress,
      payload.city,
      payload.state,
      payload.zipCode,
      payload.subtotal,
      payload.tax,
      payload.deliveryCharge,
      payload.total,
      payload.paymentMethod,
      payload.lastFour || null,
      payload.status,
      payload.createdAt || createdAt,
      payload.estimatedDelivery,
    );

    const orderRow = selectOrderByNumberStatement.get(payload.orderNumber);
    for (const item of payload.items) {
      insertOrderItemStatement.run(
        orderRow.id,
        item.product.id,
        item.product.name,
        item.product.price,
        item.product.category,
        item.product.image,
        item.product.description,
        item.quantity,
      );
    }
    
    db.exec('COMMIT');
    return hydrateOrder(orderRow);
  } catch (error) {
    db.exec('ROLLBACK');
    throw error;
  }
};

export const createCustomer = ({ email, name, phone, password }) => {
  const salt = createSalt();
  const hash = hashPassword(password, salt);
  const createdAt = new Date().toISOString();
  
  insertCustomerStatement.run(email, name, phone, hash, salt, createdAt);
  const customer = selectCustomerByEmailStatement.get(email);
  return findCustomerById(customer.id);
};

export const updateCustomerSettings = (id, data) => {
  updateCustomerSettingsStatement.run(data.name, data.phone, data.emailNotifications ? 1 : 0, id);
  return findCustomerById(id);
};

export const updateCustomerPassword = (id, hash, salt) => {
  updateCustomerPasswordStatement.run(hash, salt, id);
};

export const findCustomerById = (id) => {
  const row = db.prepare('SELECT * FROM customers WHERE id = ?').get(id);
  if (!row) return null;
  return {
    id: row.id,
    email: row.email,
    name: row.name,
    phone: row.phone,
    emailNotifications: row.email_notifications === 1,
  };
};

export const findCustomerByEmail = (email) => {
  return selectCustomerByEmailStatement.get(email);
};

export const createCustomerSession = ({ email, password, isBypassPassword }) => {
  cleanupCustomerSessionsStatement.run(new Date().toISOString());
  const customer = selectCustomerByEmailStatement.get(email);

  if (!customer) {
    return null;
  }

  if (!isBypassPassword && !verifyPassword(password, customer.password_salt, customer.password_hash)) {
    return null;
  }

  const token = createToken(32);
  const createdAt = new Date();
  const expiresAt = new Date(createdAt.getTime() + SESSION_TTL_MS).toISOString();

  insertCustomerSessionStatement.run(token, customer.id, expiresAt, createdAt.toISOString());

  return {
    token,
    customer: {
      id: customer.id,
      email: customer.email,
      name: customer.name,
      phone: customer.phone,
      emailNotifications: customer.email_notifications === 1,
    },
  };
};

export const getCustomerSession = (token) => {
  if (!token) return null;
  cleanupCustomerSessionsStatement.run(new Date().toISOString());
  const row = selectCustomerSessionStatement.get(token);
  if (!row) return null;

  return {
    token: row.token,
    customer: {
      id: row.id,
      email: row.email,
      name: row.name,
      phone: row.phone,
      emailNotifications: row.email_notifications === 1,
    },
  };
};

export const deleteCustomerSession = (token) => {
  deleteCustomerSessionStatement.run(token);
};

export const updateCustomerProfile = (id, { name, phone }) => {
  updateCustomerProfileStatement.run(name, phone, id);
  return selectCustomerByIdStatement.get(id);
};

export const deleteCustomer = (id) => {
  db.exec('BEGIN');
  try {
    // Manually handle what foreign keys SHOULD handle, to ensure compatibility
    db.prepare('UPDATE orders SET customer_id = NULL WHERE customer_id = ?').run(id);
    db.prepare('DELETE FROM notifications WHERE customer_id = ?').run(id);
    db.prepare('DELETE FROM customer_sessions WHERE customer_id = ?').run(id);
    const result = deleteCustomerStatement.run(id);
    db.exec('COMMIT');
    return result;
  } catch (error) {
    db.exec('ROLLBACK');
    throw error;
  }
};

export const setCustomerResetToken = (id, token, expires) => {
  setCustomerResetTokenStatement.run(token, expires, id);
};

export const findCustomerByResetToken = (token) => {
  const now = new Date().toISOString();
  return findCustomerByResetTokenStatement.get(token, now);
};

export const clearCustomerResetToken = (id) => {
  setCustomerResetTokenStatement.run(null, null, id);
};

export const listCustomerOrders = (customerId, email) => {
  return db.prepare('SELECT * FROM orders WHERE customer_id = ? OR lower(customer_email) = lower(?) ORDER BY datetime(created_at) DESC').all(customerId, email).map(hydrateOrder);
};

export const createNotification = ({ customerId, orderNumber, type, message }) => {
  const createdAt = new Date().toISOString();
  insertNotificationStatement.run(customerId, orderNumber, type, message, createdAt);
};

export const listCustomerNotifications = (customerId) => {
  return selectNotificationsByCustomerIdStatement.all(customerId).map(hydrateNotification);
};

export const markNotificationAsRead = (id, customerId) => {
  markNotificationReadStatement.run(id, customerId);
};

export const requestCustomerDeletion = (id) => {
  return db.prepare('UPDATE customers SET deletion_requested = 1 WHERE id = ?').run(id);
};


export const listAdminOrders = () => selectAllOrdersStatement.all().map(hydrateOrder);

export const findAdminOrderByNumber = (orderNumber) => hydrateOrder(selectOrderByNumberStatement.get(orderNumber));

export const findCustomerOrderByReference = (orderNumber, accessKey) =>
  hydrateOrder(selectOrdersByReferencesStatement.get(orderNumber, accessKey));

export const findCustomerOrdersByReferences = (references) => {
  const results = [];
  for (const reference of references) {
    const order = findCustomerOrderByReference(reference.orderNumber, reference.accessKey);
    if (order) {
      results.push(order);
    }
  }
  return results.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
};

export const updateOrderStatus = (orderNumber, status) => {
  updateOrderStatusStatement.run(status, orderNumber);
  return findAdminOrderByNumber(orderNumber);
};

export const verifyCustomerPassword = (id, password) => {
  const row = db.prepare('SELECT * FROM customers WHERE id = ?').get(id);
  if (!row) return false;
  return verifyPassword(password, row.password_salt, row.password_hash);
};

export const setCustomerOtp = (id, code, expires) => {
  db.prepare('UPDATE customers SET otp_code = ?, otp_expires = ? WHERE id = ?').run(code, expires, id);
};

export const verifyCustomerOtp = (email, code) => {
  const customer = selectCustomerByEmailStatement.get(email);
  if (!customer) return false;
  
  if (customer.otp_code === code && new Date(customer.otp_expires) > new Date()) {
    db.prepare('UPDATE customers SET is_verified = 1, otp_code = NULL, otp_expires = NULL WHERE id = ?').run(customer.id);
    return true;
  }
  return false;
};
export const createPendingVerification = (email, type, payload, otp, expires) => {
  db.prepare(`
    INSERT OR REPLACE INTO pending_verifications (email, type, payload, otp_code, expires_at)
    VALUES (?, ?, ?, ?, ?)
  `).run(email, type, JSON.stringify(payload), otp, expires);
};

export const getPendingVerification = (email) => {
  const row = db.prepare('SELECT * FROM pending_verifications WHERE email = ?').get(email);
  if (!row) return null;
  return {
    ...row,
    payload: JSON.parse(row.payload)
  };
};

export const deletePendingVerification = (email) => {
  db.prepare('DELETE FROM pending_verifications WHERE email = ?').run(email);
};
