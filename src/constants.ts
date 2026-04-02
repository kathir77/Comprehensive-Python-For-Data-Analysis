import { Topic } from './types';

export const CURRICULUM: Record<string, Topic[]> = {
  Python: [
    {
      id: 'py-beg',
      title: 'Python Basics for Data',
      level: 'Beginner',
      description: 'Foundational Python syntax and data structures essential for data manipulation.',
      concepts: ['Variables & Data Types', 'Lists, Tuples, Dictionaries', 'Control Flow (If/Else, Loops)', 'Functions & Modules', 'List Comprehensions'],
      conceptExplanations: [
        {
          title: 'Variables & Data Types',
          explanation: 'In data analysis, variables act as containers for your datasets, while data types (integers, floats, strings) determine how you can manipulate and perform calculations on your data.'
        },
        {
          title: 'Lists, Tuples, Dictionaries',
          explanation: 'These are the building blocks for organizing data. Lists are used for sequences of values, tuples for fixed records, and dictionaries for mapping unique keys to values, which is essential for efficient data lookup.'
        },
        {
          title: 'Control Flow (If/Else, Loops)',
          explanation: 'Essential for data cleaning and transformation. Loops allow you to iterate through large datasets, while conditional statements help you filter or modify data based on specific criteria.'
        },
        {
          title: 'Functions & Modules',
          explanation: 'Functions promote code reusability and modularity, allowing you to create complex data processing pipelines that are easy to maintain and share across different analysis projects.'
        },
        {
          title: 'List Comprehensions',
          explanation: 'A powerful, concise way to transform and filter data in a single line of code, significantly improving both the readability and performance of your data processing scripts.'
        }
      ],
      codeSnippet: `
# List comprehension to filter and transform data
data = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
even_squares = [x**2 for x in data if x % 2 == 0]

# Dictionary to store results
results = {
    "original": data,
    "processed": even_squares
}

print(f"Processed even squares: {results['processed']}")
      `,
      codeExplanation: "This snippet demonstrates a list comprehension that filters even numbers from a list and squares them. It then stores both the original and processed data in a dictionary for easy access. This pattern is common in data preprocessing tasks where you need to transform specific subsets of your data efficiently.",
      flashcards: [
        { term: 'Variable', definition: 'A named container for storing data values in memory.' },
        { term: 'List', definition: 'An ordered, mutable collection of items, defined with square brackets [].' },
        { term: 'Tuple', definition: 'An ordered, immutable collection of items, defined with parentheses ().' },
        { term: 'Dictionary', definition: 'An unordered collection of key-value pairs, defined with curly braces {}.' },
        { term: 'Function', definition: 'A reusable block of code that performs a specific task, defined with the def keyword.' },
        { term: 'List Comprehension', definition: 'A concise way to create lists based on existing lists or iterables.' },
        { term: 'Boolean', definition: 'A data type that can only have one of two values: True or False.' },
        { term: 'Integer', definition: 'A whole number without a fractional part.' },
        { term: 'Float', definition: 'A number with a decimal point or in scientific notation.' },
        { term: 'String', definition: 'A sequence of characters enclosed in single or double quotes.' }
      ],
      projects: [
        {
          title: 'Personal Expense Tracker',
          description: 'Build a simple command-line tool to track daily expenses using Python dictionaries and lists.',
          tasks: [
            'Create a dictionary to store categories and their total spending.',
            'Implement a function to add new expenses with a category and amount.',
            'Use a loop to display a summary of all expenses.',
            'Add a feature to calculate the total budget remaining.'
          ]
        },
        {
          title: 'Student Grade Analyzer',
          description: 'Create a script that processes a list of student records and calculates performance metrics.',
          tasks: [
            'Store student names and grades in a list of tuples or dictionaries.',
            'Write a function to calculate the average grade of the class.',
            'Use list comprehensions to filter students who scored above a certain threshold.',
            'Implement control flow to assign letter grades (A, B, C, etc.) based on numeric scores.'
          ]
        },
        {
          title: 'Inventory Management System',
          description: 'Develop a basic system to manage product inventory for a small store.',
          tasks: [
            'Use a dictionary where keys are product names and values are stock quantities.',
            'Create functions to update stock levels (add/remove items).',
            'Implement a search feature to check if a product is in stock.',
            'Generate a report of all products with low stock (less than 5 items).'
          ]
        }
      ],
      quiz: [
        {
          question: "Which of the following is a mutable data structure in Python?",
          options: ["Tuple", "String", "List", "Integer"],
          correctAnswer: 2,
          explanation: "Lists are mutable, allowing you to change, add, or remove elements after the list is created. Tuples, strings, and integers are immutable; once they are created, their values cannot be modified without creating a new object."
        },
        {
          question: "What keyword is used to define a function in Python?",
          options: ["func", "define", "def", "function"],
          correctAnswer: 2,
          explanation: "The 'def' keyword is the standard Python keyword for defining functions. 'func', 'define', and 'function' are not valid Python keywords for this purpose, though they might be used in other programming languages like JavaScript or Go."
        },
        {
          question: "Which data structure uses key-value pairs?",
          options: ["List", "Dictionary", "Set", "Tuple"],
          correctAnswer: 1,
          explanation: "Dictionaries are specifically designed to store data in key-value pairs, similar to a real-world dictionary where you look up a word (key) to find its definition (value). Lists and tuples are ordered sequences of items, while sets are unordered collections of unique items."
        },
        {
          question: "What is the output of [x**2 for x in range(3)]?",
          options: ["[1, 4, 9]", "[0, 1, 4]", "[1, 2, 3]", "[0, 1, 2]"],
          correctAnswer: 1,
          explanation: "This list comprehension iterates over 'range(3)', which generates the sequence 0, 1, 2. For each number 'x', it calculates 'x**2' (x squared). Thus, 0^2=0, 1^2=1, and 2^2=4, resulting in the list [0, 1, 4]. The other options either start at 1 or don't perform the squaring operation."
        },
        {
          question: "How do you start a block of code in Python (e.g., after an 'if' statement)?",
          options: ["Using curly braces {}", "Using parentheses ()", "Using a colon : and indentation", "Using the 'begin' keyword"],
          correctAnswer: 2,
          explanation: "Python relies on a colon (:) followed by consistent indentation to define a block of code. Unlike languages like C++ or Java that use curly braces {}, or Pascal that uses 'begin', Python's syntax uses whitespace to enforce readability and structure."
        }
      ]
    },
    {
      id: 'py-int',
      title: 'Intermediate Python',
      level: 'Intermediate',
      description: 'Moving beyond basics into functional programming and error handling.',
      concepts: ['Lambda Functions', 'Map, Filter, Reduce', 'Exception Handling', 'Working with Files (CSV, JSON)', 'Virtual Environments'],
      conceptExplanations: [
        {
          title: 'Lambda Functions',
          explanation: 'Crucial for writing quick, throwaway functions often used within Pandas or Spark transformations for efficient data processing.'
        },
        {
          title: 'Map, Filter, Reduce',
          explanation: 'The core of functional data processing. These allow you to apply transformations, filter out noise, and aggregate data into meaningful summaries.'
        },
        {
          title: 'Exception Handling',
          explanation: 'Vital for robust data pipelines. It ensures your analysis doesn\'t crash when encountering unexpected data formats or missing files.'
        }
      ],
      codeSnippet: `
# Using map and filter with lambda functions
numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

# Filter even numbers
evens = list(filter(lambda x: x % 2 == 0, numbers))

# Square the filtered numbers
squares = list(map(lambda x: x**2, evens))

print(f"Original: {numbers}")
print(f"Evens: {evens}")
print(f"Squares: {squares}")
      `,
      codeExplanation: "This example showcases functional programming in Python. We use 'filter' with a lambda function to extract even numbers, and then 'map' with another lambda to square them. This approach is often more concise than traditional loops for simple transformations."
    },
    {
      id: 'py-adv',
      title: 'Advanced Python Patterns',
      level: 'Advanced',
      description: 'Optimizing code and understanding object-oriented patterns in data pipelines.',
      concepts: ['Classes & Objects (OOP)', 'Decorators & Generators', 'Context Managers', 'Multithreading vs Multiprocessing', 'Profiling & Optimization']
    },
    {
      id: 'py-viz',
      title: 'Data Visualization (Matplotlib & Seaborn)',
      level: 'Intermediate',
      description: 'Creating impactful visualizations to communicate data insights.',
      concepts: ['Line & Scatter Plots', 'Histograms & Boxplots', 'Heatmaps & Categorical Plots', 'Customizing Figures (Axes, Legends)', 'Subplots & Layout Management'],
      conceptExplanations: [
        {
          title: 'Line & Scatter Plots',
          explanation: 'Fundamental for identifying trends and correlations. Line plots show changes over time, while scatter plots reveal relationships between two numeric variables.'
        },
        {
          title: 'Histograms & Boxplots',
          explanation: 'Essential for understanding data distribution. Histograms show frequency, while boxplots highlight outliers and quartiles.'
        }
      ],
      codeSnippet: `
import matplotlib.pyplot as plt
import seaborn as sns
import numpy as np

# Sample data
x = np.linspace(0, 10, 100)
y = np.sin(x)

# Create a plot
plt.figure(figsize=(10, 6))
sns.lineplot(x=x, y=y, label='Sine Wave')
plt.title("Simple Data Visualization")
plt.xlabel("X Axis")
plt.ylabel("Y Axis")
plt.legend()
plt.show()
      `,
      codeExplanation: "This snippet uses Matplotlib and Seaborn to create a basic line plot. Seaborn builds on top of Matplotlib to provide a more high-level interface and better default styles for statistical graphics."
    }
  ],
  Pandas: [
    {
      id: 'pd-beg',
      title: 'Pandas Foundations',
      level: 'Beginner',
      description: 'Introduction to Series and DataFrames, the core of Pandas.',
      concepts: ['Series & DataFrames', 'Loading Data (read_csv, read_excel)', 'Basic Inspection (head, info, describe)', 'Selection & Indexing (loc, iloc)', 'Filtering Data'],
      diagram: 'pandas-flow',
      conceptExplanations: [
        {
          title: 'Series & DataFrames',
          explanation: 'The primary structures for tabular data. Understanding these is essential for any structured data analysis in Python.'
        },
        {
          title: 'Loading Data',
          explanation: 'The first step in any analysis. Pandas provides powerful tools to ingest data from various sources like CSV, Excel, and SQL databases.'
        },
        {
          title: 'Selection & Indexing',
          explanation: 'Allows you to slice and dice your data, focusing on specific rows or columns that are relevant to your current analysis question.'
        }
      ],
      codeSnippet: `
import pandas as pd

# Creating a DataFrame from a dictionary
data = {
    'Name': ['Alice', 'Bob', 'Charlie', 'David'],
    'Age': [25, 30, 35, 40],
    'City': ['New York', 'Los Angeles', 'Chicago', 'Houston']
}
df = pd.DataFrame(data)

# Basic inspection
print("First 2 rows:")
print(df.head(2))

# Selecting a column
print("\\nAge column:")
print(df['Age'])

# Filtering data
print("\\nPeople older than 30:")
print(df[df['Age'] > 30])
      `,
      codeExplanation: "This snippet demonstrates the basics of Pandas: creating a DataFrame, inspecting the first few rows with 'head()', selecting a single column, and filtering rows based on a condition. These are the most fundamental operations for any data analysis task using Pandas."
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
    },
    {
      id: 'pd-ts',
      title: 'Time Series Analysis',
      level: 'Advanced',
      description: 'Specialized tools for analyzing time-dependent data.',
      concepts: ['Datetime Indexing', 'Resampling & Frequency Conversion', 'Rolling Windows', 'Shifting & Lagging', 'Timezone Handling'],
      conceptExplanations: [
        {
          title: 'Datetime Indexing',
          explanation: 'Turning a column into a DatetimeIndex unlocks powerful time-based slicing and selection capabilities in Pandas.'
        },
        {
          title: 'Resampling',
          explanation: 'Essential for changing data frequency (e.g., converting daily data to monthly) using various aggregation methods.'
        }
      ],
      codeSnippet: `
import pandas as pd

# Create a time-indexed Series
dates = pd.date_range('2023-01-01', periods=100, freq='D')
data = pd.Series(range(100), index=dates)

# Resample to weekly mean
weekly_data = data.resample('W').mean()

print("Weekly Resampled Data (First 5):")
print(weekly_data.head())
      `,
      codeExplanation: "This example shows how to create a time-indexed Series and use 'resample()' to aggregate daily data into weekly averages. This is a core task in financial and sensor data analysis."
    }
  ],
  Spark: [
    {
      id: 'sp-beg',
      title: 'PySpark Basics',
      level: 'Beginner',
      description: 'Distributed computing concepts and Spark Session.',
      concepts: ['Spark Architecture (Driver vs Worker)', 'SparkSession', 'Reading Data (CSV, Parquet)', 'DataFrames vs RDDs', 'Basic Transformations (select, filter)'],
      diagram: 'spark-arch',
      conceptExplanations: [
        {
          title: 'Spark Architecture',
          explanation: 'Understanding how Spark distributes work across a cluster is key to writing performant code for massive datasets.'
        },
        {
          title: 'SparkSession',
          explanation: 'The entry point to all Spark functionality. It manages the connection to the cluster and provides the interface for data manipulation.'
        },
        {
          title: 'DataFrames vs RDDs',
          explanation: 'DataFrames provide a higher-level, optimized API for structured data, while RDDs offer lower-level control when needed for complex distributed tasks.'
        }
      ],
      codeSnippet: `
from pyspark.sql import SparkSession

# Initialize a SparkSession
spark = SparkSession.builder \\
    .appName("PySparkBasics") \\
    .getOrCreate()

# Create a simple DataFrame
data = [("Alice", 25), ("Bob", 30), ("Charlie", 35)]
columns = ["Name", "Age"]
df = spark.createDataFrame(data, columns)

# Select and filter
df_filtered = df.select("Name", "Age").filter(df.Age > 28)

# Show the results
df_filtered.show()

# Stop the session
spark.stop()
      `,
      codeExplanation: "This PySpark example shows how to initialize a 'SparkSession', create a distributed DataFrame, and perform basic transformations like 'select' and 'filter'. Note that Spark operations are lazy; they aren't executed until an action like 'show()' is called."
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
    },
    {
      id: 'sp-ml',
      title: 'Machine Learning with MLlib',
      level: 'Advanced',
      description: 'Building scalable machine learning pipelines on big data.',
      concepts: ['Feature Engineering (VectorAssembler)', 'Classification & Regression', 'Clustering (K-Means)', 'Model Evaluation', 'Saving & Loading Models'],
      conceptExplanations: [
        {
          title: 'Feature Engineering',
          explanation: 'Spark MLlib requires features to be combined into a single vector column, typically using the VectorAssembler transformer.'
        },
        {
          title: 'ML Pipelines',
          explanation: 'Pipelines help organize complex ML workflows, ensuring that transformations are applied consistently during training and prediction.'
        }
      ],
      codeSnippet: `
from pyspark.ml.feature import VectorAssembler
from pyspark.ml.regression import LinearRegression

# Prepare data
data = [(1, 2.0, 10.0), (2, 3.0, 20.0), (3, 4.0, 30.0)]
df = spark.createDataFrame(data, ["id", "feature", "label"])

# Assemble features into a vector
assembler = VectorAssembler(inputCols=["feature"], outputCol="features")
df_assembled = assembler.transform(df)

# Train a simple model
lr = LinearRegression(featuresCol="features", labelCol="label")
model = lr.fit(df_assembled)

print(f"Coefficients: {model.coefficients}")
      `,
      codeExplanation: "This snippet demonstrates a basic Spark MLlib pipeline: assembling features into a vector and training a linear regression model. MLlib is designed to scale these operations across a cluster."
    }
  ]
};
