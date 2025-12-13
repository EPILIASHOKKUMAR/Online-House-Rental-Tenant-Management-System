
import { Router } from "express";
import { db } from "./db";

const router = Router();

router.post("/properties", (req, res) => {
  const { title, rent, location } = req.body;
  if (!title || !location || rent <= 0) {
    return res.status(400).json({ message: "Invalid property details" });
  }
  db.query("INSERT INTO properties SET ?", req.body,
    () => res.status(201).json({ message: "Property added" })
  );
});

router.get("/properties", (req, res) => {
  db.query("SELECT * FROM properties",
    (err, result) => res.json(result)
  );
});

router.post("/bookings", (req, res) => {
  const { property_id, tenant_id } = req.body;
  if (!property_id || !tenant_id) {
    return res.status(400).json({ message: "Invalid booking" });
  }
  db.query(
    "INSERT INTO bookings (property_id, tenant_id) VALUES (?, ?)",
    [property_id, tenant_id],
    () => res.status(201).json({ message: "Booking requested" })
  );
});

router.put("/bookings/:id", (req, res) => {
  const { status } = req.body;
  db.query(
    "UPDATE bookings SET status=? WHERE id=?",
    [status, req.params.id],
    () => res.json({ message: "Status updated" })
  );
});

export default router;
