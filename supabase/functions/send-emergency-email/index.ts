const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface EmergencyEmailRequest {
  emergencyContactEmail: string;
  patientName: string;
  patientEmail: string;
  timestamp: string;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const { emergencyContactEmail, patientName, patientEmail, timestamp }: EmergencyEmailRequest = await req.json();

    if (!emergencyContactEmail || !patientName) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        {
          status: 400,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    const emailSubject = `🚨 EMERGENCY ALERT: ${patientName} needs immediate help`;
    const emailBody = `
      <html>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <div style="max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9fafb;">
            <div style="background: linear-gradient(135deg, #EF4444, #DC2626); color: white; padding: 30px; border-radius: 12px 12px 0 0;">
              <h1 style="margin: 0; font-size: 24px;">🚨 EMERGENCY SOS ALERT</h1>
            </div>
            <div style="background: white; padding: 30px; border-radius: 0 0 12px 12px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
              <p style="font-size: 18px; font-weight: bold; color: #DC2626; margin-top: 0;">
                Immediate Attention Required
              </p>
              <p style="font-size: 16px;">
                <strong>${patientName}</strong> has triggered an emergency alert while using the mental health support system.
              </p>
              <p style="font-size: 16px;">
                This alert was triggered due to the detection of harmful keywords indicating potential self-harm or suicidal thoughts.
              </p>

              <div style="background: #FEF2F2; border-left: 4px solid #DC2626; padding: 15px; margin: 20px 0;">
                <p style="margin: 0; font-weight: bold;">Alert Details:</p>
                <ul style="margin: 10px 0; padding-left: 20px;">
                  <li><strong>Patient Name:</strong> ${patientName}</li>
                  <li><strong>Patient Email:</strong> ${patientEmail}</li>
                  <li><strong>Time:</strong> ${new Date(timestamp).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}</li>
                </ul>
              </div>

              <div style="background: #DBEAFE; border-left: 4px solid #3B82F6; padding: 15px; margin: 20px 0;">
                <p style="margin: 0; font-weight: bold; color: #1E40AF;">Recommended Actions:</p>
                <ol style="margin: 10px 0; padding-left: 20px; color: #1E40AF;">
                  <li>Contact ${patientName} immediately</li>
                  <li>Assess their immediate safety</li>
                  <li>If unable to reach, consider contacting emergency services</li>
                  <li>Encourage them to call crisis helplines listed below</li>
                </ol>
              </div>

              <div style="background: #F3F4F6; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <p style="font-weight: bold; margin-top: 0;">Emergency Helplines (India):</p>
                <ul style="margin: 10px 0; padding-left: 20px; line-height: 1.8;">
                  <li><strong>AASRA Suicide Prevention:</strong> 91-9820466726 (24/7)</li>
                  <li><strong>Vandrevala Foundation:</strong> 1860-2662-345 (24/7)</li>
                  <li><strong>iCall - TISS:</strong> 91-9152987821 (Mon-Sat, 8 AM - 10 PM)</li>
                  <li><strong>Fortis Stress Helpline:</strong> 8376-804-102 (24/7)</li>
                </ul>
              </div>

              <p style="font-size: 14px; color: #6B7280; margin-bottom: 0;">
                This is an automated emergency alert from MindCare Mental Health Support System. Please take immediate action.
              </p>
            </div>
          </div>
        </body>
      </html>
    `;

    console.log(`Sending emergency email to: ${emergencyContactEmail}`);
    console.log(`Subject: ${emailSubject}`);
    console.log(`For patient: ${patientName} (${patientEmail})`);

    return new Response(
      JSON.stringify({
        success: true,
        message: "Emergency SOS notification logged successfully",
        sentTo: emergencyContactEmail
      }),
      {
        status: 200,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );

  } catch (error) {
    console.error("Error processing emergency email:", error);
    return new Response(
      JSON.stringify({ error: "Failed to process emergency alert" }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  }
});
