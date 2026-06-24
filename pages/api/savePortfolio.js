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

  const { password, data, newPassword } = req.body;
  const fbSecret = process.env.FIREBASE_SECRET;
  const fbBaseUrl = `https://doser-portfolio-default-rtdb.firebaseio.com/admin_config.json?auth=${fbSecret}`;

  try {
    // 1. Fetch current stored password
    const configResp = await fetch(fbBaseUrl);
    const configData = configResp.ok ? await configResp.json() : null;
    const currentPass = configData?.password || process.env.ADMIN_PASSWORD;

    // 2. Verify password
    if (password !== currentPass) {
      return res.status(401).json({ message: 'Unauthorized: Incorrect password' });
    }

    // 3. Handle Password Change Request
    if (newPassword) {
      const updateResp = await fetch(fbBaseUrl, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...configData, password: newPassword })
      });
      if (updateResp.ok) {
        return res.status(200).json({ message: 'Password updated successfully!' });
      }
      return res.status(500).json({ message: 'Failed to update password in database' });
    }

    // 4. Handle Data Save Request
    if (!data) {
       return res.status(200).json({ message: 'Password OK' });
    }

    const response = await fetch(`https://doser-portfolio-default-rtdb.firebaseio.com/portfolioData.json?auth=${fbSecret}`, {
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

