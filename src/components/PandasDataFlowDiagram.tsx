import React from 'react';
import { motion } from 'motion/react';
import { FileText, Table, Filter, BarChart3, ArrowRight, Database, Activity } from 'lucide-react';

export const PandasDataFlowDiagram: React.FC = () => {
  return (
    <div className="p-8 bg-zinc-50 border border-zinc-200 rounded-3xl space-y-8 overflow-hidden">
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-xl font-bold text-zinc-900 flex items-center gap-2">
          <Database className="text-indigo-600" size={20} />
          Pandas Data Analysis Workflow
        </h3>
        <div className="px-3 py-1 bg-indigo-100 text-indigo-700 text-[10px] font-bold uppercase tracking-widest rounded-full">
          Standard Pipeline
        </div>
      </div>

      <div className="flex flex-col md:flex-row items-center justify-between gap-4 relative">
        {/* Step 1: Ingest */}
        <div className="flex flex-col items-center gap-3 z-10">
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="w-20 h-20 bg-white border-2 border-zinc-200 rounded-2xl shadow-sm flex items-center justify-center text-zinc-400 hover:border-indigo-500 hover:text-indigo-500 transition-colors"
          >
            <FileText size={32} />
          </motion.div>
          <div className="text-center">
            <div className="text-[10px] font-bold text-zinc-900 uppercase">Ingest</div>
            <div className="text-[8px] text-zinc-500 italic">read_csv()</div>
          </div>
        </div>

        <ArrowRight className="hidden md:block text-zinc-300" size={24} />

        {/* Step 2: DataFrame */}
        <div className="flex flex-col items-center gap-3 z-10">
          <motion.div 
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="w-24 h-24 bg-indigo-600 rounded-2xl shadow-lg flex items-center justify-center text-white relative"
          >
            <Table size={40} />
            <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center shadow-md">
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              >
                <Database size={14} />
              </motion.div>
            </div>
          </motion.div>
          <div className="text-center">
            <div className="text-[10px] font-bold text-zinc-900 uppercase">DataFrame</div>
            <div className="text-[8px] text-zinc-500 italic">In-Memory Table</div>
          </div>
        </div>

        <ArrowRight className="hidden md:block text-zinc-300" size={24} />

        {/* Step 3: Transform */}
        <div className="flex flex-col items-center gap-3 z-10">
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="w-20 h-20 bg-white border-2 border-zinc-200 rounded-2xl shadow-sm flex items-center justify-center text-zinc-400 hover:border-indigo-500 hover:text-indigo-500 transition-colors"
          >
            <Filter size={32} />
          </motion.div>
          <div className="text-center">
            <div className="text-[10px] font-bold text-zinc-900 uppercase">Transform</div>
            <div className="text-[8px] text-zinc-500 italic">groupby / filter</div>
          </div>
        </div>

        <ArrowRight className="hidden md:block text-zinc-300" size={24} />

        {/* Step 4: Insight */}
        <div className="flex flex-col items-center gap-3 z-10">
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="w-20 h-20 bg-white border-2 border-zinc-200 rounded-2xl shadow-sm flex items-center justify-center text-zinc-400 hover:border-indigo-500 hover:text-indigo-500 transition-colors"
          >
            <BarChart3 size={32} />
          </motion.div>
          <div className="text-center">
            <div className="text-[10px] font-bold text-zinc-900 uppercase">Insight</div>
            <div className="text-[8px] text-zinc-500 italic">plot() / describe()</div>
          </div>
        </div>

        {/* Background Flow Line */}
        <div className="absolute top-10 left-10 right-10 h-0.5 bg-zinc-100 -z-0 hidden md:block" />
      </div>

      <div className="p-4 bg-white border border-zinc-200 rounded-2xl">
        <div className="flex items-start gap-4">
          <div className="p-2 bg-emerald-50 rounded-lg">
            <Activity className="text-emerald-600" size={16} />
          </div>
          <div className="space-y-1">
            <h5 className="text-xs font-bold text-zinc-900">Why Pandas is Fast</h5>
            <p className="text-[10px] text-zinc-600 leading-relaxed">
              Pandas uses <strong>vectorized operations</strong>. Instead of looping through rows one by one, 
              it performs calculations on entire columns (Series) at once using highly optimized C and Fortran code.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
