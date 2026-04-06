const parseJsonFields = (allowedFields = []) => {
  return (req, res, next) => {
    try {
      Object.keys(req.body).forEach((key) => {
        const value = req.body[key];

        // ✅ Sirf allowed fields hi parse hon
        if (!allowedFields.includes(key)) return;

        // ✅ Sirf string hi parse karo
        if (typeof value !== "string") return;

        const trimmed = value.trim();

        // ✅ JSON jaisa lag raha ho tabhi parse karo
        const isJsonLike =
          (trimmed.startsWith("{") && trimmed.endsWith("}")) ||
          (trimmed.startsWith("[") && trimmed.endsWith("]"));

        if (!isJsonLike) return;

        try {
          req.body[key] = JSON.parse(trimmed);
        } catch (err) {
          throw new Error(`Invalid JSON in field: ${key}`);
        }
      });

      next();
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  };
};

export default parseJsonFields;