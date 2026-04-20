export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
  },
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { password, data } = req.body;

  // Verify the password sent from the client against the server secret
  if (password !== process.env.ADMIN_PASSWORD) {
    return res.status(401).json({ message: 'Unauthorized: Incorrect password' });
  }

  // If data is null, it's just a login check
  if (!data) {
    return res.status(200).json({ message: 'Password OK' });
  }

  try {
    // The server writes to Firebase securely using the Database Secret to bypass rules
    const response = await fetch(`https://doser-portfolio-default-rtdb.firebaseio.com/portfolioData.json?auth=${process.env.FIREBASE_SECRET}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    if (response.ok) {
      return res.status(200).json({ message: 'Data saved successfully!' });
    } else {
      const errorText = await response.text();
      return res.status(500).json({ message: `Firebase Error: ${errorText}` });
    }
  } catch (error) {
    return res.status(500).json({ message: 'Network error connecting to Firebase.' });
  }
}
