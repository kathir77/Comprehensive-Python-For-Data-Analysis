import React from 'react';
import { motion } from 'motion/react';
import { Server, Cpu, ArrowRight, Database, Activity } from 'lucide-react';

export const SparkArchitectureDiagram: React.FC = () => {
  return (
    <div className="p-8 bg-zinc-50 border border-zinc-200 rounded-3xl space-y-8 overflow-hidden">
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-xl font-bold text-zinc-900 flex items-center gap-2">
          <Activity className="text-indigo-600" size={20} />
          Spark Architecture: Driver vs. Workers
        </h3>
        <div className="flex items-center gap-4 text-xs font-medium text-zinc-500">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-indigo-500 rounded-sm" />
            Control Flow
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-emerald-500 rounded-sm" />
            Data Flow
          </div>
        </div>
      </div>

      <div className="relative flex flex-col items-center justify-center gap-12">
        {/* Driver Node */}
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="relative z-10 w-64 p-6 bg-white border-2 border-indigo-500 rounded-2xl shadow-xl text-center"
        >
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-3 py-1 bg-indigo-500 text-white text-[10px] font-bold uppercase tracking-widest rounded-full">
            Driver Node
          </div>
          <Server className="mx-auto mb-3 text-indigo-600" size={32} />
          <h4 className="font-bold text-zinc-900 mb-1">SparkSession</h4>
          <p className="text-[10px] text-zinc-500 leading-tight">
            Orchestrates tasks, schedules jobs, and manages the DAG.
          </p>
          
          {/* Animated Control Lines */}
          <div className="absolute top-full left-1/2 -translate-x-1/2 h-12 w-px bg-indigo-200" />
        </motion.div>

        {/* Cluster Manager (Implicit) */}
        <div className="w-full h-px bg-zinc-200 relative">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 px-4 py-1 bg-zinc-100 text-zinc-400 text-[10px] font-medium uppercase tracking-widest border border-zinc-200 rounded-full">
            Cluster Manager (YARN / K8s / Standalone)
          </div>
        </div>

        {/* Worker Nodes */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
          {[1, 2, 3].map((i) => (
            <motion.div 
              key={i}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: i * 0.1 }}
              className="relative p-5 bg-white border border-zinc-200 rounded-2xl shadow-sm hover:border-emerald-400 transition-colors group"
            >
              <div className="absolute -top-3 left-4 px-2 py-0.5 bg-zinc-100 text-zinc-500 text-[8px] font-bold uppercase tracking-widest rounded-md border border-zinc-200">
                Worker {i}
              </div>
              <div className="flex items-center gap-3 mb-3">
                <Cpu className="text-emerald-500" size={20} />
                <div className="text-xs font-bold text-zinc-700">Executor</div>
              </div>
              <div className="space-y-2">
                <div className="h-1.5 w-full bg-zinc-100 rounded-full overflow-hidden">
                  <motion.div 
                    animate={{ width: ['20%', '80%', '40%', '90%', '60%'] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                    className="h-full bg-emerald-400" 
                  />
                </div>
                <div className="flex justify-between text-[8px] text-zinc-400 font-mono">
                  <span>TASK_RUNNING</span>
                  <span>MEM: 4GB</span>
                </div>
              </div>

              {/* Data Flow Animation */}
              <motion.div 
                className="absolute -top-12 left-1/2 -translate-x-1/2 text-emerald-500"
                animate={{ y: [0, 48], opacity: [0, 1, 0] }}
                transition={{ duration: 2, repeat: Infinity, delay: i * 0.5 }}
              >
                <ArrowRight className="rotate-90" size={16} />
              </motion.div>
            </motion.div>
          ))}
        </div>

        {/* Storage Layer */}
        <div className="w-full p-4 bg-zinc-900 rounded-2xl flex items-center justify-center gap-8 text-zinc-400">
          <div className="flex items-center gap-2">
            <Database size={16} />
            <span className="text-xs font-bold uppercase tracking-widest">Distributed Storage (HDFS / S3)</span>
          </div>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map(j => (
              <motion.div 
                key={j}
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 1, repeat: Infinity, delay: j * 0.2 }}
                className="w-2 h-4 bg-emerald-500/30 rounded-sm" 
              />
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8 pt-8 border-t border-zinc-200">
        <div className="space-y-2">
          <h5 className="text-xs font-bold text-zinc-900 uppercase tracking-wider">The Driver's Role</h5>
          <p className="text-xs text-zinc-600 leading-relaxed">
            The Driver is the "brain" of your application. It converts your code into a logical plan (DAG), 
            splits it into stages and tasks, and schedules them across the workers.
          </p>
        </div>
        <div className="space-y-2">
          <h5 className="text-xs font-bold text-zinc-900 uppercase tracking-wider">The Worker's Role</h5>
          <p className="text-xs text-zinc-600 leading-relaxed">
            Workers provide the "muscle." Each worker runs one or more Executors, which are responsible 
            for executing the tasks assigned by the driver and storing data in memory or disk.
          </p>
        </div>
      </div>
    </div>
  );
};
