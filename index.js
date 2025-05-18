const express = require('express');
const app = express();

// Use the port from Render or default to 3000 locally
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('✅ AKALI ESTHUNDHI MALLI);
});

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});

