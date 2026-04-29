import handler from '../server/index.js';

export default async function (req, res) {
  // Bridge for Vercel's incoming request object
  // Vercel sometimes parses the body automatically if it's JSON
  // Our handler expects a raw stream or a way to read the body
  
  // To ensure compatibility with our custom 'readJsonBody' which uses 'for await' on the request stream:
  // If req.body is already present (parsed by Vercel), we might need to handle it.
  // However, the Node.js runtime on Vercel usually leaves the stream open unless configured otherwise.
  
  return handler(req, res);
}
