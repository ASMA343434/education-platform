import mysql from 'mysql2/promise';
import bcrypt from 'bcryptjs';

const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME
});

export default async function handler(req, res) {
  if (req.method === 'POST') {
    if (req.body.action === 'login') {
      const { username, password } = req.body;
      try {
        const [rows] = await db.execute(
          'SELECT * FROM users WHERE username = ?',
          [username]
        );
        if (rows.length > 0 && await bcrypt.compare(password, rows[0].password)) {
          res.status(200).json({ success: true });
        } else {
          res.status(401).json({ error: 'Invalid credentials' });
        }
      } catch (error) {
        res.status(500).json({ error: 'Database error' });
      }
    }
    // Handle register similarly
  }
}
