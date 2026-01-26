import { createClient } from "https://esm.sh/@supabase/supabase-js@2.90.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Content-Security-Policy": "frame-ancestors 'self'",
  "X-Frame-Options": "SAMEORIGIN",
  "X-Content-Type-Options": "nosniff",
  "Cache-Control": "no-store, no-cache, must-revalidate, private",
  "Pragma": "no-cache",
  "Expires": "0",
};

const RATE_LIMIT_MAX = 30; // requests per minute
const SIGNED_URL_EXPIRY = 60; // seconds

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {
    // Validate authorization header
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Create Supabase client
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY")!;

    // Client for auth validation
    const supabaseAuth = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } },
    });

    // Service role client for admin operations
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

    // Validate JWT and get user
    const token = authHeader.replace("Bearer ", "");
    const { data: claimsData, error: claimsError } =
      await supabaseAuth.auth.getClaims(token);

    if (claimsError || !claimsData?.claims) {
      console.error("Auth error:", claimsError);
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const userId = claimsData.claims.sub as string;

    // Parse request body
    const { filePath, resourceId } = await req.json();

    if (!filePath || typeof filePath !== "string") {
      return new Response(
        JSON.stringify({ error: "filePath is required" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Validate referrer (basic hotlink protection)
    const referer = req.headers.get("referer") || req.headers.get("origin");
    const allowedOrigins = [
      "localhost",
      "lovable.app",
      "lovable.dev",
      "juicyfish.in",
    ];
    
    if (referer) {
      const refererUrl = new URL(referer);
      const isAllowed = allowedOrigins.some(
        (origin) =>
          refererUrl.hostname === origin ||
          refererUrl.hostname.endsWith(`.${origin}`)
      );

      if (!isAllowed) {
        console.warn(`Blocked request from unauthorized origin: ${referer}`);
        return new Response(
          JSON.stringify({ error: "Forbidden" }),
          {
            status: 403,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }
    }

    // Rate limiting check
    const windowStart = new Date();
    windowStart.setSeconds(0, 0); // Round to current minute

    // Get current rate limit count
    const { data: rateLimitData } = await supabaseAdmin
      .from("rate_limits")
      .select("request_count")
      .eq("user_id", userId)
      .eq("action_type", "file_access")
      .gte("window_start", windowStart.toISOString())
      .single();

    const currentCount = rateLimitData?.request_count || 0;

    if (currentCount >= RATE_LIMIT_MAX) {
      console.warn(`Rate limit exceeded for user ${userId}`);
      return new Response(
        JSON.stringify({ error: "Rate limit exceeded. Please try again later." }),
        {
          status: 429,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
            "Retry-After": "60",
          },
        }
      );
    }

    // Update rate limit counter using upsert
    await supabaseAdmin.from("rate_limits").upsert(
      {
        user_id: userId,
        action_type: "file_access",
        window_start: windowStart.toISOString(),
        request_count: currentCount + 1,
      },
      {
        onConflict: "user_id,action_type,window_start",
      }
    );

    // Log file access attempt
    const clientIp =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      req.headers.get("cf-connecting-ip") ||
      "unknown";
    const userAgent = req.headers.get("user-agent") || "unknown";

    await supabaseAdmin.from("file_access_logs").insert({
      user_id: userId,
      resource_id: resourceId || null,
      file_path: filePath,
      access_type: "view",
      ip_address: clientIp,
      user_agent: userAgent,
      referrer: referer || null,
    });

    // Generate signed URL
    const { data: signedUrlData, error: signedUrlError } =
      await supabaseAdmin.storage
        .from("resources")
        .createSignedUrl(filePath, SIGNED_URL_EXPIRY);

    if (signedUrlError || !signedUrlData?.signedUrl) {
      console.error("Signed URL error:", signedUrlError);
      return new Response(
        JSON.stringify({ error: "Failed to generate access URL" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    console.log(`File access granted: ${filePath} for user ${userId}`);

    return new Response(
      JSON.stringify({
        signedUrl: signedUrlData.signedUrl,
        expiresIn: SIGNED_URL_EXPIRY,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Server error:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
