export interface Topic {
  id: string;
  title: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Master';
  description: string;
  concepts: string[];
}

export const CURRICULUM: Record<string, Topic[]> = {
  Python: [
    {
      id: 'py-beg',
      title: 'Python Basics for Data',
      level: 'Beginner',
      description: 'Foundational Python syntax and data structures essential for data manipulation.',
      concepts: ['Variables & Data Types', 'Lists, Tuples, Dictionaries', 'Control Flow (If/Else, Loops)', 'Functions & Modules', 'List Comprehensions']
    },
    {
      id: 'py-int',
      title: 'Intermediate Python',
      level: 'Intermediate',
      description: 'Moving beyond basics into functional programming and error handling.',
      concepts: ['Lambda Functions', 'Map, Filter, Reduce', 'Exception Handling', 'Working with Files (CSV, JSON)', 'Virtual Environments']
    },
    {
      id: 'py-adv',
      title: 'Advanced Python Patterns',
      level: 'Advanced',
      description: 'Optimizing code and understanding object-oriented patterns in data pipelines.',
      concepts: ['Classes & Objects (OOP)', 'Decorators & Generators', 'Context Managers', 'Multithreading vs Multiprocessing', 'Profiling & Optimization']
    }
  ],
  Pandas: [
    {
      id: 'pd-beg',
      title: 'Pandas Foundations',
      level: 'Beginner',
      description: 'Introduction to Series and DataFrames, the core of Pandas.',
      concepts: ['Series & DataFrames', 'Loading Data (read_csv, read_excel)', 'Basic Inspection (head, info, describe)', 'Selection & Indexing (loc, iloc)', 'Filtering Data']
    },
    {
      id: 'pd-int',
      title: 'Data Wrangling',
      level: 'Intermediate',
      description: 'Cleaning and transforming data for analysis.',
      concepts: ['Handling Missing Values', 'Groupby & Aggregation', 'Merging & Joining (merge, concat)', 'Pivot Tables', 'Datetime Manipulation']
    },
    {
      id: 'pd-adv',
      title: 'Advanced Analytics',
      level: 'Advanced',
      description: 'High-performance operations and complex transformations.',
      concepts: ['Window Functions (rolling, expanding)', 'Vectorized Operations', 'Categorical Data', 'Multi-indexing', 'Performance Tuning (eval, query)']
    }
  ],
  Spark: [
    {
      id: 'sp-beg',
      title: 'PySpark Basics',
      level: 'Beginner',
      description: 'Distributed computing concepts and Spark Session.',
      concepts: ['Spark Architecture (Driver vs Worker)', 'SparkSession', 'Reading Data (CSV, Parquet)', 'DataFrames vs RDDs', 'Basic Transformations (select, filter)']
    },
    {
      id: 'sp-int',
      title: 'Spark SQL & Transformations',
      level: 'Intermediate',
      description: 'Leveraging SQL and complex transformations in a distributed environment.',
      concepts: ['Spark SQL', 'Joins & Unions', 'UDFs (User Defined Functions)', 'Caching & Persistence', 'Broadcast Variables']
    },
    {
      id: 'sp-adv',
      title: 'Spark Performance & Tuning',
      level: 'Advanced',
      description: 'Mastering the execution engine and optimizing big data jobs.',
      concepts: ['Partitioning & Shuffling', 'Adaptive Query Execution (AQE)', 'Skew Handling', 'Spark UI Debugging', 'Memory Management']
    },
    {
      id: 'sp-mas',
      title: 'Mastering Spark Streaming & MLlib',
      level: 'Master',
      description: 'Real-time data processing and scalable machine learning.',
      concepts: ['Structured Streaming', 'Windowing in Streams', 'MLlib Pipelines', 'Custom Estimators & Transformers', 'Hyperparameter Tuning at Scale']
    }
  ]
};
