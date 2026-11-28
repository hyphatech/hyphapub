1. "AI-generated code" names both vibe-coded slop and clean, deliberate work, and the LLM is the only thing they have in common.
2. Andrej Karpathy named vibe coding for weekend projects, but the name came to cover every codebase nobody understands.
3. He later named the other activity agentic engineering, designing the system and stating its constraints, then letting agents build what has already been reasoned through.
4. Both start with a person asking and an agent writing, so critics conclude that nobody did any engineering, which is exactly true of vibe coding.
5. Rich Hickey is right that an LLM is automation, not a tool you wield.
6. Most AGENTS.md files are voodoo.md, a page of pleading the model reads when it feels like it.
7. The old answer to automation is a jig, which controls where the work sits and where the tool goes, so the hundredth cut comes out like the first.
8. Vibe coding makes requests of automation and hopes, while agentic engineering builds the jig the automation runs in and checks every cut against it.
9. The jig starts with questions asked before any code exists, until every branch of the plan is resolved and written down as a PRD whose scenarios the agent has to pass as tests.
10. Then comes a ubiquitous language, one meaning per word, defined once and held in every repository.
11. A rule is worth nothing until it says how you find out you broke it.
12. Where that check can be automated, the rule moves into it, because an instruction can be ignored and a check cannot.
13. In the best jigs the agent marks nothing done itself, and its work counts only when the build, the tests and the checks outside it pass.
14. An agent asked not to touch a file can still touch it, but one fenced in to its paths cannot.
15. The compiler is the strictest part of the jig, the one reviewer that never gets tired and cannot be talked round.
16. When the types make an illegal state impossible to write, a whole kind of mistake no longer depends on anyone noticing it.
17. [Hypha Stack](https://hyphatech.io/stack) takes that to the edges where systems usually break.
18. Machine-written code was doubted when FORTRAN was built, yet nobody now reads a compiler's output to decide whether to trust it.
19. Reviewing an agent's code line by line is a road to nowhere, because agents write more than anyone can read, and a review is a judgement, never a proof.
20. What I read is the jig, and when a mistake gets through I add a check, so that kind of mistake is gone for good.
21. When the jig is right, what comes out of it is more consistent than anything I wrote by hand.
22. People specify, the system enforces, and that is where the engineering moved, out of the code, the part of the work that is still yours.
