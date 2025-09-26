Your task is to help build out a syllabus for me to feel comfortable when I start my interview process with a multitude of AI companies.

<my_background>
* I worked at 3 early stage startups, spending 3 years at the first one, and 1.5 years at the subsequent 2 and then took a year off. My skills feel a little rusty in the minutiae of coding but I have a deep systems background and can quickly catch on to higher level concepts. I am most proficient in javascript and typescript. 
* I just completed the anthropic intro to claude API 8 hour class which has taught me tool use, prompt evaluation, prompt execution, agents, workflows and a sample MCP server.
</my_background>

<goal>
# CLI ASCII Art Generator - Interview Requirements
Priority 1: Critical (Must Have) - 35-40 minutes
1. Command Line Argument Parsing (Priority: 9/10)

Parse node cli.js draw --shape circle --size 10 format
Handle both long (--shape) and short (-s) flags
Validate required vs optional parameters
Why critical: Shows understanding of CLI patterns and input validation

2. Basic Shape Generation - Rectangle (Priority: 10/10)

Generate hollow and filled rectangles
Handle width/height parameters
Clean ASCII rendering with consistent characters
Why critical: Tests basic algorithm skills and string manipulation

3. Error Handling & User Feedback (Priority: 8/10)

Meaningful error messages for invalid inputs
Help text (--help flag)
Handle edge cases (size 0, negative numbers)
Why critical: Shows production-ready thinking and user experience awareness

Priority 2: Important (Should Have) - 15-20 minutes
4. Circle Generation Algorithm (Priority: 7/10)

Implement circle using distance formula
Handle different sizes reasonably well
Why important: Tests mathematical problem-solving and algorithm design

5. File Output (Priority: 6/10)

--output filename.txt flag
Write generated ASCII to file
Why important: Shows I/O handling and practical utility thinking

6. Code Architecture (Priority: 8/10)

Separate concerns (parser, generator, renderer)
Clean function interfaces
Reusable components
Why important: Critical for senior role - shows system design skills

Priority 3: Nice to Have (Stretch Goals) - 5-10 minutes
7. Triangle Generation (Priority: 5/10)

Basic triangle algorithm
Why nice to have: Additional algorithm practice, but not essential

8. Custom Characters (Priority: 4/10)

--char "*" flag to change drawing character
Why nice to have: Shows attention to customization, but low impact

9. Interactive Mode (Priority: 6/10)

REPL-style interface for multiple commands
Why nice to have: Shows advanced CLI patterns, but time-intensive

Evaluation Weights:

Functional core (Rectangle + Parsing): 40%
Code quality & architecture: 25%
Error handling & UX: 20%
Algorithm complexity (Circle): 10%
Bonus features: 5%

Time Breakdown Recommendation:

15 min: CLI parsing + basic structure
15 min: Rectangle generation
10 min: Error handling + help system
15 min: Circle algorithm
5 min: File output or polish

Key Insight: Better to nail the fundamentals (parsing, rectangles, errors) with clean code than attempt everything poorly.
</goal>

<timing>
I have 12 working days on my calendar where I have provisioned 3 hours a day to give fully to building up my confidence with claude code
</timing>

<examples>
* Be able to generate different fractal shapes based off parameters given to me in the command line interface
</examples>

<output>
I would like to have essentially 12 3-hour blocks with goals and objectives in the description. Because you dont have context into how much I get done, I will also send back how much I got done in the days since so we can tweak it based off of my performance 
</output>

<structure>
For the structure of the 12 outputs, each group of 4 should have a silly theme just to make me giggle, and each of the days inside should have a fun name that corresponds to that theme. The structure should be as follows:

THEME: [the overall theme of the group of 4 days]
DAY: [silly name of the day that corresponds to the theme]
MOTIVATIONAL QUOTE: [a tiny quote in the style of jack kornfield buddhist psychology meant to ground me as I try to do something outside my comfort zone]
OBJECTIVES: [a list of 3-5 objectives for me to complete that day in the 3 hour timespan]
GIFT: [a tiny reward for myself for completing this certain days work, it can be a walk, meditation, somethng that is easy and accessible for me to feel good about]
READ: [a little dig at me as if i was a contestant on rupauls drag race but done in a loving way to motivate me on my studies]
FEEDBACK: [this will be left intentionally blank]

</structure>

STEPS:
1. Create the 12 working days blocks as follows. These will be put in my google calendar later but for now, generate a document in markdown with all of the requirements.
