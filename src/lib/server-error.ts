export default async function errorHandler(error: any, event: any) {
  const status = error.status || error.statusCode || 500;
  const message = error.message || String(error);
  const stack = error.stack || null;
  const url = event?.url?.href || event?.req?.url || null;

  console.error("[Nitro Server Error]", message, stack);

  return new Response(
    JSON.stringify(
      {
        error: true,
        status,
        message,
        stack: stack ? stack.split("\n") : null,
        url,
      },
      null,
      2
    ),
    {
      status,
      headers: {
        "content-type": "application/json; charset=utf-8",
      },
    }
  );
}
