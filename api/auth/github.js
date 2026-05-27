export default function handler(req, res) {
  const clientId = process.env.GITHUB_CLIENT_ID;
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://open-zeus.vercel.app';
  const redirectUri = `${baseUrl}/api/auth/callback`;

  if (!clientId) {
    return res.status(500).json({ error: 'GITHUB_CLIENT_ID is not set' });
  }

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    scope: 'repo read:user',
    allow_signup: 'true',
  });

  const githubAuthUrl = `https://github.com/login/oauth/authorize?${params.toString()}`;
  res.redirect(302, githubAuthUrl);
}
