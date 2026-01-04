import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

// Email validation regex
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Valid Nigerian states
const validStates = [
  "Abia", "Adamawa", "Akwa Ibom", "Anambra", "Bauchi", "Bayelsa", "Benue", "Borno",
  "Cross River", "Delta", "Ebonyi", "Edo", "Ekiti", "Enugu", "FCT Abuja", "Gombe",
  "Imo", "Jigawa", "Kaduna", "Kano", "Katsina", "Kebbi", "Kogi", "Kwara", "Lagos",
  "Nasarawa", "Niger", "Ogun", "Ondo", "Osun", "Oyo", "Plateau", "Rivers", "Sokoto",
  "Taraba", "Yobe", "Zamfara"
];

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const { name, email, phone, state, farm_size_ha, crop_type, message, company_name } = body;

    // Server-side validation
    if (!name || typeof name !== "string") {
      throw new Error("Name is required");
    }
    const trimmedName = name.trim();
    if (trimmedName.length === 0 || trimmedName.length > 100) {
      throw new Error("Name must be between 1 and 100 characters");
    }

    if (!email || typeof email !== "string") {
      throw new Error("Email is required");
    }
    const trimmedEmail = email.trim().toLowerCase();
    if (!emailRegex.test(trimmedEmail) || trimmedEmail.length > 255) {
      throw new Error("Invalid email address");
    }

    if (!phone || typeof phone !== "string") {
      throw new Error("Phone number is required");
    }
    const trimmedPhone = phone.trim();
    if (trimmedPhone.length === 0 || trimmedPhone.length > 20) {
      throw new Error("Phone number must be between 1 and 20 characters");
    }

    if (!state || typeof state !== "string") {
      throw new Error("State is required");
    }
    if (!validStates.includes(state)) {
      throw new Error("Invalid state selected");
    }

    // Optional field validation
    let validatedFarmSize = null;
    if (farm_size_ha !== null && farm_size_ha !== undefined && farm_size_ha !== "") {
      const farmSizeNum = Number(farm_size_ha);
      if (isNaN(farmSizeNum) || farmSizeNum <= 0 || farmSizeNum > 1000000) {
        throw new Error("Farm size must be a positive number");
      }
      validatedFarmSize = farmSizeNum;
    }

    let validatedMessage = null;
    if (message && typeof message === "string") {
      const trimmedMessage = message.trim();
      if (trimmedMessage.length > 2000) {
        throw new Error("Message must be less than 2000 characters");
      }
      validatedMessage = trimmedMessage || null;
    }

    let validatedCompanyName = null;
    if (company_name && typeof company_name === "string") {
      const trimmedCompany = company_name.trim();
      if (trimmedCompany.length > 200) {
        throw new Error("Company name must be less than 200 characters");
      }
      validatedCompanyName = trimmedCompany || null;
    }

    let validatedCropType = null;
    if (crop_type && typeof crop_type === "string") {
      const trimmedCrop = crop_type.trim();
      if (trimmedCrop.length > 100) {
        throw new Error("Crop type must be less than 100 characters");
      }
      validatedCropType = trimmedCrop || null;
    }

    // Create Supabase client with service role key for insert
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    console.log("Submitting service request:", {
      name: trimmedName,
      email: trimmedEmail,
      phone: trimmedPhone,
      state,
      farm_size_ha: validatedFarmSize,
      crop_type: validatedCropType,
    });

    const { error } = await supabase.from("service_requests").insert([
      {
        name: trimmedName,
        email: trimmedEmail,
        phone: trimmedPhone,
        state,
        farm_size_ha: validatedFarmSize,
        crop_type: validatedCropType,
        message: validatedMessage,
        company_name: validatedCompanyName,
      },
    ]);

    if (error) {
      console.error("Database insert error:", error);
      throw new Error("Failed to submit request. Please try again.");
    }

    console.log("Service request submitted successfully");

    return new Response(
      JSON.stringify({ success: true, message: "Request submitted successfully" }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error processing service request:", error);
    
    const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred";
    
    return new Response(
      JSON.stringify({ success: false, error: errorMessage }),
      {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
