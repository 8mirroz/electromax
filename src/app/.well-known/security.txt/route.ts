export function GET() {
  const body = [
    "Contact: mailto:info@electromax.pro",
    "Preferred-Languages: ru, en",
    `Canonical: https://electromax.pro/.well-known/security.txt`,
    `Expires: 2027-02-28T00:00:00.000Z`,
  ].join("\n");

  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
