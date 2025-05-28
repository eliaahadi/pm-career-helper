import React, { useState, useEffect } from "react";
import resources from "./data/resources.json";

export default function PMHelperApp() {
  // theme (light / dark)
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  useEffect(() => {
    const stored = localStorage.getItem('pmTheme');
    if (stored === 'dark' || stored === 'light') {
      setTheme(stored);
    }
  }, []);
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('pmTheme', theme);
  }, [theme]);

  const [section, setSection] = useState<string>('jobsearch');
  const [searchTerm, setSearchTerm] = useState<string>('');

  // favorites persisted in localStorage
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  // recently viewed hrefs
  const [recent, setRecent] = useState<string[]>([]);
  // notes per resource, keyed by href
  const [notes, setNotes] = useState<Record<string, string>>({});
  // modal state for editing notes
  const [noteModalHref, setNoteModalHref] = useState<string | null>(null);
  const [noteText, setNoteText] = useState<string>('');

  // sort options
  const [sortOption, setSortOption] = useState<'default'|'alpha'|'favorites'|'recent'>('default');

  // authentication state
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');
  const [loginModalOpen, setLoginModalOpen] = useState(false);

  // mock interview state
  const mockQuestions = [
    "Describe a time you prioritized features under tight deadlines.",
    "How would you measure success for a new feature launch?",
    "Walk me through the system design for a simple notification service.",
    "Tell me about a product decision you made based on user data.",
    "How do you balance technical debt vs. feature velocity?"
  ];
  const [currentQuestion, setCurrentQuestion] = useState<string | null>(null);
  const [mockAnswer, setMockAnswer] = useState<string>('');
  const [savedAnswers, setSavedAnswers] = useState<Record<string, string>>({});

  // load persisted data
  useEffect(() => {
    const f = localStorage.getItem('pmFavorites');
    if (f) setFavorites(new Set(JSON.parse(f)));
    const r = localStorage.getItem('pmRecent');
    if (r) setRecent(JSON.parse(r));
    const n = localStorage.getItem('pmNotes');
    if (n) setNotes(JSON.parse(n));
    const ma = localStorage.getItem('pmMockAnswers');
    if (ma) setSavedAnswers(JSON.parse(ma));
  }, []);
  useEffect(() => {
    localStorage.setItem('pmFavorites', JSON.stringify(Array.from(favorites)));
  }, [favorites]);
  useEffect(() => {
    localStorage.setItem('pmRecent', JSON.stringify(recent));
  }, [recent]);
  useEffect(() => {
    localStorage.setItem('pmNotes', JSON.stringify(notes));
  }, [notes]);
  useEffect(() => {
    localStorage.setItem('pmMockAnswers', JSON.stringify(savedAnswers));
  }, [savedAnswers]);

  // helpers
  const recordRecent = (href: string) => {
    setRecent(prev => [href, ...prev.filter(h => h !== href)].slice(0,5));
  };
  const allResources = [...resources.jobsearch, ...resources.interviews];
  const getTitle = (href: string) => allResources.find(r => r.href === href)?.title || href;
  const openNotesModal = (href: string) => { setNoteModalHref(href); setNoteText(notes[href]||''); };
  const saveNote = () => { if(noteModalHref){ setNotes(prev=>({ ...prev, [noteModalHref]:noteText })); setNoteModalHref(null); }};
  const nextMockQuestion = () => {
    const q = mockQuestions[Math.floor(Math.random()*mockQuestions.length)];
    setCurrentQuestion(q);
    setMockAnswer(savedAnswers[q]||'');
  };

  const sortList = (list: {title:string, href:string}[]) => {
    let sorted = [...list];
    if(sortOption==='alpha') sorted.sort((a,b)=>a.title.localeCompare(b.title));
    else if(sortOption==='favorites') sorted.sort((a,b)=> (favorites.has(b.href)?1:0)-(favorites.has(a.href)?1:0));
    else if(sortOption==='recent') sorted.sort((a,b)=>{
      const iA=recent.indexOf(a.href), iB=recent.indexOf(b.href);
      return (iA<0?Infinity:iA)-(iB<0?Infinity:iB);
    });
    return sorted;
  };
  const copyFavorites = () => {
    const list = Array.from(favorites).map(h=>getTitle(h)).join('\n');
    navigator.clipboard.writeText(list).then(()=>alert('Favorites copied!'));
  };

  return (
    <div className="relative max-w-3xl mx-auto p-6 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 rounded-lg shadow-lg">
      <header className="mb-6 border-b border-gray-200 dark:border-gray-700 pb-4">
        <div className="flex items-center justify-between">
          <div className="flex space-x-2">
            {['jobsearch','interviews','favorites','recent','mock'].map(sec=>(
              <button key={sec}
                className={`px-4 py-2 rounded ${section===sec?'bg-blue-600 text-white':'bg-gray-200'}`}
                onClick={()=>setSection(sec)}>{sec.replace(/^[a-z]/,c=>c.toUpperCase().replace('jobsearch','Job search').replace('mock','Mock interview'))}
              </button>
            ))}
          </div>
          <div className="flex items-center space-x-2">
            {isLoggedIn ? (
              <button
                className="px-3 py-1 bg-green-600 text-white rounded"
                onClick={() => {
                  setIsLoggedIn(false);
                  setUserName('');
                }}
              >
                Logout
              </button>
            ) : (
              <button
                className="px-3 py-1 bg-blue-600 text-white rounded"
                onClick={() => setLoginModalOpen(true)}
              >
                Login
              </button>
            )}
            <button
              className="p-2 bg-gray-200 dark:bg-gray-700 rounded"
              onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
              aria-label="Toggle theme"
            >
              {theme === 'light' ? '🌙' : '☀️'}
            </button>
          </div>
        </div>
      {isLoggedIn && (
        <p className="mb-4 text-center">Hello, {userName}!</p>
      )}
        <div className="mt-4 flex flex-col sm:flex-row items-center gap-4">
          <input
            type="text"
            placeholder="Search resources..."
            className="border rounded px-3 py-2 w-full max-w-md"
            value={searchTerm} onChange={e=>setSearchTerm(e.target.value)}
          />
          <select className="border rounded px-3 py-2"
            value={sortOption} onChange={e=>setSortOption(e.target.value as any)}>
            <option value="default">Sort: default</option>
            <option value="alpha">A→Z</option>
            <option value="favorites">Favorites first</option>
            <option value="recent">Recent first</option>
          </select>
        </div>
      </header>

      {/* Job search */}
      {section==='jobsearch' && <section className="mt-8">
        <h2 className="text-2xl font-semibold mb-4">Job search</h2>
        <ul className="space-y-4">
          {sortList(resources.jobsearch.filter(item=>item.title.toLowerCase().includes(searchTerm.toLowerCase())))
            .map(item=> (
              <li key={item.href} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-4 rounded flex justify-between items-center">
                <a href={item.href} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline" onClick={()=>recordRecent(item.href)}>
                  {item.title}
                </a>
                <div className="space-x-2">
                  <button onClick={()=>{ const s=new Set(favorites); s.has(item.href)?s.delete(item.href):s.add(item.href); setFavorites(s); }} className="text-xl">{favorites.has(item.href)?'★':'☆'}</button>
                  <button onClick={()=>openNotesModal(item.href)} className="text-xl">📝</button>
                </div>
              </li>
            ))
          }
        </ul>
        <div className="text-center mt-4">
          <button className="px-4 py-2 bg-green-600 text-white rounded" onClick={()=>{
            const list=resources.jobsearch.filter(item=>item.title.toLowerCase().includes(searchTerm.toLowerCase()));
            window.open(list[Math.floor(Math.random()*list.length)].href,'_blank');
          }}>suggest a random resource</button>
        </div>
      </section>}

      {/* Interviews */}
      {section==='interviews' && <section className="mt-8">
        <h2 className="text-2xl font-semibold mb-4">Interviews</h2>
        <ul className="space-y-4">
          {sortList(resources.interviews.filter(item=>item.title.toLowerCase().includes(searchTerm.toLowerCase())))
            .map(item=> (
              <li key={item.href} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-4 rounded flex justify-between items-center">
                <a href={item.href} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline" onClick={()=>recordRecent(item.href)}>
                  {item.title}
                </a>
                <div className="space-x-2">
                  <button onClick={()=>{ const s=new Set(favorites); s.has(item.href)?s.delete(item.href):s.add(item.href); setFavorites(s); }} className="text-xl">{favorites.has(item.href)?'★':'☆'}</button>
                  <button onClick={()=>openNotesModal(item.href)} className="text-xl">📝</button>
                </div>
              </li>
            ))
          }
        </ul>
        <div className="text-center mt-4">
          <button className="px-4 py-2 bg-green-600 text-white rounded" onClick={()=>{
            const list=resources.interviews.filter(item=>item.title.toLowerCase().includes(searchTerm.toLowerCase()));
            window.open(list[Math.floor(Math.random()*list.length)].href,'_blank');
          }}>suggest a random resource</button>
        </div>
      </section>}

      {/* Favorites */}
      {section==='favorites' && <section className="mt-8">
        <h2 className="text-2xl font-semibold mb-4">Your favorites</h2>
        <ul className="space-y-4">{Array.from(favorites).map(href=>{
          const item=allResources.find(r=>r.href===href);
          return item?(<li key={href} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-4 rounded flex justify-between items-center">
            <a href={item.href} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{item.title}</a>
            <button onClick={()=>{const s=new Set(favorites); s.delete(href); setFavorites(s);}} className="text-xl">★</button>
          </li>):null;
        })}</ul>
        <div className="text-center mt-4"><button className="px-4 py-2 bg-indigo-600 text-white rounded" onClick={copyFavorites}>Copy favorites</button></div>
      </section>}

      {/* Recent */}
      {section==='recent' && <section className="mt-8">
        <h2 className="text-2xl font-semibold mb-4">Recently viewed</h2>
        <ul className="space-y-4">{recent.map(href=>{
          const title=getTitle(href);
          return (<li key={href} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-4 rounded flex justify-between items-center">
            <a href={href} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline" onClick={()=>recordRecent(href)}>{title}</a>
          </li>);
        })}</ul>
      </section>}

      {/* Mock interview */}
      {section==='mock' && <section className="mt-8 bg-white dark:bg-gray-800 p-6 rounded border border-gray-200 dark:border-gray-700">
        <h2 className="text-2xl font-semibold mb-4">Mock interview</h2>
        <div className="space-y-4">
          <button className="px-4 py-2 bg-indigo-600 text-white rounded" onClick={nextMockQuestion}>Next question</button>
          {currentQuestion && (
            <>
              <p className="italic mb-2">{currentQuestion}</p>
              <textarea rows={5} className="w-full border rounded px-3 py-2 dark:bg-gray-900 dark:border-gray-700" placeholder="Type your answer here..." value={mockAnswer} onChange={e=>setMockAnswer(e.target.value)}/>
              <button className="px-4 py-2 bg-green-600 text-white rounded" onClick={()=>{setSavedAnswers(prev=>({...prev,[currentQuestion]:mockAnswer}));alert('Answer saved!');}}>Save answer</button>
            </>
          )}
          {Object.keys(savedAnswers).length>0 && (
            <div className="mt-4">
              <h3 className="font-semibold mb-2">Saved answers:</h3>
              <div className="space-y-3">{Object.entries(savedAnswers).map(([q,a])=>(
                <div key={q} className="bg-gray-100 dark:bg-gray-700 p-3 rounded">
                  <strong className="block mb-1">{q}</strong>
                  <p className="ml-4">{a}</p>
                </div>
              ))}</div>
            </div>
          )}
        </div>
      </section>}

      {/* Notes Modal */}
      {noteModalHref && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white dark:bg-gray-900 rounded-lg p-6 w-full max-w-md">
            <h3 className="text-xl font-semibold mb-2">Notes for {getTitle(noteModalHref)}</h3>
            <textarea className="w-full border rounded p-2 mb-4 dark:bg-gray-900 dark:border-gray-700" rows={6} value={noteText} onChange={e=>setNoteText(e.target.value)}/>
            <div className="flex justify-end space-x-2">
              <button className="px-4 py-2 bg-gray-300 dark:bg-gray-700 rounded" onClick={()=>setNoteModalHref(null)}>Cancel</button>
              <button className="px-4 py-2 bg-blue-600 text-white rounded" onClick={saveNote}>Save</button>
            </div>
          </div>
        </div>
      )}
      {loginModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg w-full max-w-sm">
            <h3 className="text-xl font-semibold mb-4">Login</h3>
            <button
              className="w-full mb-2 px-4 py-2 bg-red-500 text-white rounded"
              onClick={() => {
                setIsLoggedIn(true);
                setUserName('Google User');
                setLoginModalOpen(false);
              }}
            >
              Continue with Google
            </button>
            <button
              className="w-full mb-4 px-4 py-2 bg-black text-white rounded"
              onClick={() => {
                setIsLoggedIn(true);
                setUserName('Apple User');
                setLoginModalOpen(false);
              }}
            >
              Continue with Apple
            </button>
            <button
              className="px-4 py-2 bg-gray-300 rounded w-full"
              onClick={() => setLoginModalOpen(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}