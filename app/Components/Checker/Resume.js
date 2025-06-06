"use client";

import { useState } from "react";
import Head from "next/head";

export default function ResumeChecker() {
  const [resumeText, setResumeText] = useState("");
  const [jobRole, setJobRole] = useState("general");
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("paste");

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file && file.type === "text/plain") {
      const reader = new FileReader();
      reader.onload = (e) => {
        setResumeText(e.target.result);
      };
      reader.readAsText(file);
    } else {
      alert("Please upload a .txt file");
    }
  };

  const analyzeResume = async () => {
    if (!resumeText.trim()) {
      alert("Please enter or upload your resume text");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/analyze-resume", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ resumeText, jobRole }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      setAnalysis(data);
    } catch (error) {
      console.error("Error:", error);
      alert("Error analyzing resume. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    if (score >= 40) return "text-orange-600";
    return "text-red-600";
  };

  const getScoreBg = (score) => {
    if (score >= 80) return "bg-green-100";
    if (score >= 60) return "bg-yellow-100";
    if (score >= 40) return "bg-orange-100";
    return "bg-red-100";
  };

  return (
    <div className="min-h-screen bg-[url(/resume.jpg)] bg-center bg-cover">
      <Head>
        <title>AI Resume Checker</title>
        <meta name="description" content="Analyze and improve your resume with AI" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-4">
            AI-Powered Resume Checker
          </h1>
          <p className="text-base sm:text-lg text-black/80 text-shadow-2xs text-shadow-gray-300">
            Upload or paste your resume to get instant AI-powered feedback and improvement suggestions
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="bg-black/80 border border-white/80 shadow-lg rounded-lg p-4 sm:p-6 mb-8">
            <h2 className="text-xl sm:text-2xl text-white font-semibold mb-4">Upload Your Resume</h2>

            <div className="flex flex-wrap gap-4 mb-4 border-b">
              <button
                className={`px-4 py-2 font-medium ${
                  activeTab === "paste"
                    ? "text-blue-600 border-b-2 border-blue-600"
                    : "text-gray-400"
                }`}
                onClick={() => setActiveTab("paste")}
              >
                Paste Text
              </button>
              <button
                className={`px-4 py-2 font-medium ${
                  activeTab === "upload"
                    ? "text-blue-600 border-b-2 border-blue-600"
                    : "text-gray-400"
                }`}
                onClick={() => setActiveTab("upload")}
              >
                Upload File
              </button>
            </div>

            {activeTab === "paste" ? (
              <textarea
                className="w-full h-48 sm:h-64 p-3 sm:p-4 border border-gray-300 rounded-lg text-white bg-black/50 resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Paste your resume text here..."
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
              />
            ) : (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 sm:p-8 text-center">
                <input type="file" accept=".txt" onChange={handleFileUpload} className="hidden" id="file-upload" />
                <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center">
                  <svg
                    className="w-10 h-10 sm:w-12 sm:h-12 text-gray-400 mb-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                    />
                  </svg>
                  <span className="text-white text-sm sm:text-base">Click to upload .txt file</span>
                </label>
              </div>
            )}

            <div className="mt-4">
              <label className="block text-sm font-medium text-white mb-2">
                Job Role (Optional - for targeted analysis)
              </label>
              <select
                className="w-full p-3 text-white bg-black/50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                value={jobRole}
                onChange={(e) => setJobRole(e.target.value)}
              >
                <option value="general">General Analysis</option>
                <option value="software developer">Software Developer</option>
                <option value="data scientist">Data Scientist</option>
                <option value="product manager">Product Manager</option>
                <option value="marketing">Marketing</option>
                <option value="sales">Sales</option>
              </select>
            </div>

            <button
              onClick={analyzeResume}
              disabled={loading || !resumeText.trim()}
              className="mt-6 w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? "Analyzing..." : "Analyze Resume"}
            </button>
          </div>

          {analysis && (
            <div className="bg-black/60 rounded-lg shadow-md p-4 sm:p-6">
              <h2 className="text-xl sm:text-2xl text-white font-semibold mb-6">Analysis Results</h2>

              <div className={`${getScoreBg(analysis.overallScore)} rounded-lg p-4 sm:p-6 mb-6`}>
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-lg sm:text-xl font-semibold text-gray-800">Overall Score</h3>
                    <p className="text-gray-600">Your resume strength: {analysis.strength}</p>
                  </div>
                  <div className={`text-3xl sm:text-4xl font-bold ${getScoreColor(analysis.overallScore)}`}>
                    {analysis.overallScore}/100
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-700">Word Count</h4>
                  <p className="text-2xl font-bold text-blue-600">{analysis.wordCount}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-700">Readability</h4>
                  <p className="text-2xl font-bold text-green-600">{analysis.readabilityScore}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-700">Weak Sections</h4>
                  <p className="text-2xl font-bold text-red-600">{analysis.weakSections.length}</p>
                </div>
              </div>

              {analysis.jobRoleMatch && (
                <div className="bg-blue-50 rounded-lg p-4 sm:p-6 mb-6">
                  <h3 className="text-lg sm:text-xl font-semibold mb-4">Job Role Match Analysis</h3>
                  <div className="mb-4">
                    <div className="flex justify-between items-center mb-2 text-sm sm:text-base">
                      <span>Match Percentage</span>
                      <span className="font-bold">{analysis.jobRoleMatch.matchPercentage}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${analysis.jobRoleMatch.matchPercentage}%` }}
                      ></div>
                    </div>
                  </div>
                  <p className="text-gray-700 mb-2 text-sm sm:text-base">
                    <strong>Recommendation:</strong> {analysis.jobRoleMatch.recommendation}
                  </p>
                  {analysis.jobRoleMatch.missingKeywords.length > 0 && (
                    <p className="text-red-600 text-sm sm:text-base">
                      Missing Keywords: {analysis.jobRoleMatch.missingKeywords.join(", ")}
                    </p>
                  )}
                </div>
              )}

              <div>
                <h3 className="text-lg sm:text-xl text-white font-semibold mb-4">Suggestions</h3>
                <ul className="list-disc list-inside space-y-2 text-sm sm:text-base">
                  {analysis.suggestions.map((suggestion, index) => (
                    <li key={index} className="text-white">
                      {suggestion}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
