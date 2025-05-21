// app/PMHelperApp.tsx
"use client";
import React from "react";

export default function PMHelperApp() {
  const [section, setSection] = React.useState<"home"|"jobsearch"|"interviews">("home");

  const navBtnClass = (active: boolean) =>
    `px-4 py-2 rounded ${active ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-800"}`;

  return (
    <div className="p-6 max-w-xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold text-center">PM Career Helper</h1>

      <div className="flex justify-center space-x-4">
        <button className={navBtnClass(section === "jobsearch")} onClick={() => setSection("jobsearch")}>
          Job search
        </button>
        <button className={navBtnClass(section === "interviews")} onClick={() => setSection("interviews")}>
          Interviews
        </button>
      </div>

      {section === "home" && (
        <div className="bg-white shadow rounded p-6 text-center">
          select a section above to get started
        </div>
      )}

      {section === "jobsearch" && (
        <div className="bg-white shadow rounded p-6 space-y-4">
          <h2 className="text-2xl font-semibold">aspiring pm resources</h2>
          <ul className="list-disc pl-5 space-y-1 text-gray-700">
            <li>how to get into PM (guide & checklist)</li>
            <li>resume builder tips</li>
            <li>job board links for PM roles</li>
            <li>LinkedIn profile optimization</li>
            <li>outreach message templates</li>
          </ul>
        </div>
      )}

      {section === "interviews" && (
        <div className="bg-white shadow rounded p-6 space-y-4">
          <h2 className="text-2xl font-semibold">mock interviews & offer prep</h2>
          <ul className="list-disc pl-5 space-y-1 text-gray-700">
            <li>behavioral question bank + example answers</li>
            <li>product sense case study practice</li>
            <li>execution / metrics interview prep</li>
            <li>offer negotiation checklist</li>
            <li>book a mock interview session</li>
          </ul>
        </div>
      )}
    </div>
  );
}