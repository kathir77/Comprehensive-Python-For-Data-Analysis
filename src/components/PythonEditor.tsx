import React, { useState, useEffect, useRef } from 'react';
import Editor from '@monaco-editor/react';
import { Play, RotateCcw, Terminal, AlertCircle, CheckCircle2, Loader2, Copy, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface PythonEditorProps {
  initialCode?: string;
  topicTitle: string;
}

export function PythonEditor({ initialCode = '', topicTitle }: PythonEditorProps) {
  const [code, setCode] = useState(initialCode);
  const [output, setOutput] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [isPyodideLoaded, setIsPyodideLoaded] = useState(false);
  const pyodideRef = useRef<any>(null);

  useEffect(() => {
    setCode(initialCode);
  }, [initialCode]);

  useEffect(() => {
    const loadPyodide = async () => {
      try {
        // @ts-ignore
        if (window.loadPyodide) {
          // @ts-ignore
          pyodideRef.current = await window.loadPyodide({
            indexURL: "https://cdn.jsdelivr.net/pyodide/v0.25.0/full/"
          });
          setIsPyodideLoaded(true);
          return;
        }

        const script = document.createElement('script');
        script.src = "https://cdn.jsdelivr.net/pyodide/v0.25.0/full/pyodide.js";
        script.onload = async () => {
          // @ts-ignore
          pyodideRef.current = await window.loadPyodide({
            indexURL: "https://cdn.jsdelivr.net/pyodide/v0.25.0/full/"
          });
          setIsPyodideLoaded(true);
        };
        document.head.appendChild(script);
      } catch (err) {
        console.error("Failed to load Pyodide:", err);
        setError("Failed to initialize Python environment. Please check your internet connection.");
      }
    };

    loadPyodide();
  }, []);

  const runCode = async () => {
    if (!pyodideRef.current || isRunning) return;

    setIsRunning(true);
    setError(null);
    // Don't clear output immediately, maybe user wants to compare
    
    try {
      // Capture stdout
      pyodideRef.current.runPython(`
import sys
import io
sys.stdout = io.StringIO()
      `);

      // Load packages from imports
      await pyodideRef.current.loadPackagesFromImports(code);

      await pyodideRef.current.runPythonAsync(code);
      
      const stdout = pyodideRef.current.runPython("sys.stdout.getvalue()");
      const newOutput = stdout.split('\n').filter((line: string) => line !== '');
      
      if (newOutput.length === 0) {
        setOutput(["[Code executed successfully with no output]"]);
      } else {
        setOutput(newOutput);
      }
    } catch (err: any) {
      if (err instanceof Error) {
        setError(err.message);
      } else if (typeof err === 'string') {
        setError(err);
      } else if (err && typeof err === 'object') {
        setError(JSON.stringify(err, null, 2));
      } else {
        setError("An unknown error occurred while running the code.");
      }
    } finally {
      setIsRunning(false);
    }
  };

  const [isCopied, setIsCopied] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const clearOutput = () => {
    setOutput([]);
    setError(null);
  };

  const resetCode = () => {
    setCode(initialCode);
    clearOutput();
  };

  return (
    <div className="bg-white border border-zinc-200 rounded-2xl overflow-hidden shadow-sm">
      <div className="bg-zinc-50 px-6 py-4 border-b border-zinc-200 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg">
            <Terminal size={18} />
          </div>
          <div>
            <h4 className="text-sm font-bold text-zinc-900">Interactive Python Editor</h4>
            <p className="text-[10px] text-zinc-500 uppercase tracking-wider font-medium">Practice: {topicTitle}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={copyToClipboard}
            className="p-2 text-zinc-500 hover:bg-zinc-200 rounded-lg transition-colors"
            title="Copy Code"
          >
            {isCopied ? <Check size={18} className="text-green-500" /> : <Copy size={18} />}
          </button>
          <button
            onClick={resetCode}
            className="p-2 text-zinc-500 hover:bg-zinc-200 rounded-lg transition-colors"
            title="Reset Code"
          >
            <RotateCcw size={18} />
          </button>
          <button
            onClick={runCode}
            disabled={!isPyodideLoaded || isRunning}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-bold hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
          >
            {isRunning ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <Play size={18} fill="currentColor" />
            )}
            Run Code
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 h-[400px]">
        <div className="border-r border-zinc-200 relative">
          {!isPyodideLoaded && (
            <div className="absolute inset-0 z-10 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center text-center p-6">
              <Loader2 size={32} className="text-indigo-600 animate-spin mb-4" />
              <p className="text-sm font-medium text-zinc-900">Initializing Python Environment...</p>
              <p className="text-xs text-zinc-500 mt-1">This may take a few seconds on first load.</p>
            </div>
          )}
          <Editor
            height="100%"
            defaultLanguage="python"
            theme="vs-light"
            value={code}
            onChange={(value) => setCode(value || '')}
            options={{
              minimap: { enabled: false },
              fontSize: 14,
              lineNumbers: 'on',
              scrollBeyondLastLine: false,
              automaticLayout: true,
              padding: { top: 16, bottom: 16 },
            }}
          />
        </div>

        <div className="bg-zinc-900 flex flex-col overflow-hidden">
          <div className="px-4 py-2 bg-zinc-800 border-b border-zinc-700 flex items-center justify-between">
            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Output</span>
            <div className="flex items-center gap-2">
              {output.length > 0 && (
                <button
                  onClick={clearOutput}
                  className="text-[10px] text-zinc-500 hover:text-zinc-300 transition-colors"
                >
                  Clear
                </button>
              )}
              {output.length > 0 && !error && (
                <CheckCircle2 size={14} className="text-green-500" />
              )}
            </div>
          </div>
          <div className="flex-1 p-6 font-mono text-sm overflow-y-auto">
            <AnimatePresence mode="wait">
              {error ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-start gap-3 text-red-400"
                >
                  <AlertCircle size={18} className="shrink-0 mt-0.5" />
                  <pre className="whitespace-pre-wrap break-all">{error}</pre>
                </motion.div>
              ) : output.length > 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-1 text-zinc-300"
                >
                  {output.map((line, idx) => (
                    <div key={idx} className="flex gap-3">
                      <span className="text-zinc-600 select-none">{idx + 1}</span>
                      <span>{line}</span>
                    </div>
                  ))}
                </motion.div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-zinc-600 text-center space-y-2">
                  <Terminal size={32} strokeWidth={1} />
                  <p className="text-xs italic">Run your code to see the output here.</p>
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
