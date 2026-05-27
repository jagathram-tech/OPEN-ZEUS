export default async function handler(req, res) {
  const { code } = req.query;
  const clientId = process.env.GITHUB_CLIENT_ID;
  const clientSecret = process.env.GITHUB_CLIENT_SECRET;
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://open-zeus.vercel.app';

  if (!code) {
    return res.redirect(302, `${baseUrl}/#gh_error=no_code`);
  }

  if (!clientId || !clientSecret) {
    return res.redirect(302, `${baseUrl}/#gh_error=server_misconfigured`);
  }

  try {
    const tokenRes = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        client_id: clientId,
        client_secret: clientSecret,
        code,
      }),
    });

    const data = await tokenRes.json();

    if (data.error || !data.access_token) {
      const errMsg = encodeURIComponent(data.error_description || data.error || 'unknown_error');
      return res.redirect(302, `${baseUrl}/#gh_error=${errMsg}`);
    }

    // Redirect back to app with token in hash (never hits server logs)
    return res.redirect(302, `${baseUrl}/#gh_token=${data.access_token}`);
  } catch (err) {
    const errMsg = encodeURIComponent(err.message || 'fetch_failed');
    return res.redirect(302, `${baseUrl}/#gh_error=${errMsg}`);
  }
}
