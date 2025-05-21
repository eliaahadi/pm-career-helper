"use client";
import React from "react";
import resources from "./data/resources.json";

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
          <h2 className="text-2xl font-semibold">aspiring PM resources</h2>
          <ol className="list-decimal pl-5 space-y-1 text-blue-600 underline">
            {resources.jobsearch.map((item) => (
              <li key={item.title}>
                <a
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:opacity-80"
                >
                  {item.title}
                </a>
              </li>
            ))}
          </ol>
        </div>
      )}

      {section === "interviews" && (
        <div className="bg-white shadow rounded p-6 space-y-4">
          <h2 className="text-2xl font-semibold">mock interviews & offer prep</h2>
          <ol className="list-decimal pl-5 space-y-1 text-blue-600 underline">
            {resources.interviews.map((item) => (
              <li key={item.title}>
                <a
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:opacity-80"
                >
                  {item.title}
                </a>
              </li>
            ))}
          </ol>
        </div>
      )}
    </div>
  );
}