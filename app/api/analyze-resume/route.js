export async function POST(req) {
  try {
    const { resumeText, jobRole } = await req.json();

    if (!resumeText || resumeText.trim().length === 0) {
      return new Response(
        JSON.stringify({ error: "Resume text is required." }),
        { status: 400 }
      );
    }

    // Basic analysis simulation (replace with real AI or logic)
    const wordCount = resumeText.trim().split(/\s+/).length;
    const overallScore = Math.min(100, Math.max(0, Math.floor(wordCount / 5))); // example score
    const strength =
      overallScore > 75 ? "Strong" : overallScore > 50 ? "Moderate" : "Weak";
    const weakSections = []; // dummy empty array for now

    // Job role matching dummy logic:
    const keywordsByRole = {
      "software developer": ["JavaScript", "React", "Node", "API", "Git"],
      "data scientist": ["Python", "Data", "Machine Learning", "Statistics"],
      "product manager": ["Agile", "Scrum", "Roadmap", "Stakeholders"],
      marketing: ["SEO", "Content", "Social Media", "Campaign"],
      sales: ["CRM", "Leads", "Negotiation", "Quota"],
      general: [],
    };

    const requiredKeywords = keywordsByRole[jobRole.toLowerCase()] || [];

    const missingKeywords = requiredKeywords.filter(
      (keyword) => !resumeText.toLowerCase().includes(keyword.toLowerCase())
    );

    const matchPercentage = requiredKeywords.length
      ? Math.floor(
          ((requiredKeywords.length - missingKeywords.length) /
            requiredKeywords.length) *
            100
        )
      : 100;

    const recommendation =
      matchPercentage < 80
        ? "Add more relevant keywords to better match the job role."
        : "Your resume matches the job role well!";

    // Readability score dummy (use real lib or AI for real)
    const readabilityScore = Math.floor(100 - wordCount / 10);

    // Suggestions dummy
    const suggestions = [];
    if (overallScore < 50) {
      suggestions.push("Consider adding more detailed experience and skills.");
    }
    if (missingKeywords.length > 0) {
      suggestions.push(
        `Include keywords related to your target job role: ${missingKeywords.join(
          ", "
        )}.`
      );
    }
    suggestions.push("Proofread your resume for spelling and grammar.");

    const result = {
      overallScore,
      strength,
      wordCount,
      readabilityScore,
      weakSections,
      jobRoleMatch: {
        matchPercentage,
        recommendation,
        missingKeywords,
      },
      suggestions,
    };

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({
        error: "Internal Server Error",
        details: error.message,
      }),
      { status: 500 }
    );
  }
}
