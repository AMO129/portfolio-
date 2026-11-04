export function isSameOriginRequest(request: Request): boolean {
  const originHeader = request.headers.get("origin");
  if (!originHeader) return false;

  let origin: URL;
  try {
    origin = new URL(originHeader);
  } catch {
    return false;
  }

  // Render terminates TLS at its proxy, so use its forwarded public host/protocol
  // instead of Next.js's internal request URL when checking the browser origin.
  const host = (request.headers.get("x-forwarded-host") ?? request.headers.get("host") ?? "")
    .split(",")[0]
    .trim()
    .toLowerCase();
  const protocol = (request.headers.get("x-forwarded-proto") ?? new URL(request.url).protocol.replace(":", ""))
    .split(",")[0]
    .trim()
    .toLowerCase();

  return Boolean(host) && origin.host.toLowerCase() === host && origin.protocol === `${protocol}:`;
}
