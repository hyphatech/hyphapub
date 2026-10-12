---
title: "Engineering moved out of the code"
date: 2026-10-16T12:00:00.000Z
description: "Using an agent doesn’t make you an agentic engineer, and you are ready for this conversation."
author: roman
series: agentic-engineering
---

I drafted this post with an agent. Openings and closings are never easy, so I asked it to brainstorm a few. What I got back was a fascinating story that happened to me recently. Plausible, well made... and not mine. Absolutely fictional.

Plenty of engineers would take that as proof that an LLM can't be trusted with anything, and blame any code it wrote before reading a line of it. Most arguments about AI and code I hear run on that reflex. Meanwhile everyone who works with an agent thinks of themselves as a 10x engineer. In one case the result is real slop, vibe-coded shit nobody can follow. In another the same kind of LLM-assisted work comes out clean and deliberate, the kind of code a senior engineer would put their name to. Both get called "AI-generated code", and the LLM is the only thing they have in common.

In February 2025 [Andrej Karpathy](https://karpathy.ai), who co-founded OpenAI and led AI at Tesla, named one of them: "There's a new kind of coding I call 'vibe coding', where you fully give in to the vibes, embrace exponentials, and forget that the code even exists."[^1] He meant weekend projects, and said so. The name escaped anyway, and came to cover every codebase nobody can follow. A year later he gave the other activity its name, agentic engineering: designing the system and stating its constraints, then letting agents build what has already been reasoned through.[^2] He talked it through with Sequoia's Stephanie Zhan:

[Andrej Karpathy: From Vibe Coding to Agentic Engineering](https://www.youtube.com/watch?v=96jN2OCOfLs)

What they share is the setup: in both, a person asks and an agent writes the code. So the critics see an agent at the keyboard and conclude that nobody did any engineering. About vibe coding, they are right.

## A tool is something you wield

[Rich Hickey](https://en.wikipedia.org/wiki/Rich_Hickey), widely known in narrow circles as the creator of Clojure, has made the sharpest case for the critics, and he made it the way he makes everything: by defining the word first. A tool is something you wield, held in the hand, under continuous control, telling you what it touches. An agent is none of that. You make a request and it acts on its own. "LLMs are not wielded. LLMs are automation."[^3] And the people trying to steer it, he says, end up "filling voodoo.md with just the right incantations", one model update away from all of it being worthless.

He is right, and most `AGENTS.md` files are `voodoo.md`: a page of pleading the model reads when it feels like it. "Follow the style guide." "Never swallow errors." "Make no mistakes this time." (We have all written that last one.)

But automation is old, and so is the answer to it. Nobody steers a lathe with incantations. You build a jig.

A jig is the dumbest object in a workshop. It cuts nothing. It controls where the work sits and where the tool goes, for "repeatability, accuracy, and interchangeability",[^jig] so the hundredth cut comes out like the first, whoever pushes the saw and however tired they are. What the shop knows lives in the jig, not in the operator's head, and the operator can change.

**Vibe coding makes requests of automation and hopes. Agentic engineering builds the jig the automation runs in, and checks every cut against it.**

## Building the jig

![What the product must do, in the people's own words, is questioned until it becomes a decision a person signs off. The agent starts from that decision and writes the code, which passes three checks on every change: the vocabulary, the house rules, and the compiler with the tests. What passes lands as one commit with its tests and documents. What a check refuses goes back to the agent, which fixes it and tries again.](/images/engineering-moved-out-of-the-code/people-decide-the-system-enforces.svg)

The cheapest part of the jig is made of questions, asked before any code exists. [Matt Pocock](https://www.mattpocock.com) has put a great deal of work into a method for agentic engineering that actually works, and his collection of agent skills is, in his words, what he uses "to do real engineering - not vibe coding".[^4] The place to start is his `grilling`: before anything is built, the agent interviews you about the plan, one question at a time, each with the answer it would recommend, until every branch of the decision is resolved. What it leaves behind is a shared understanding, written down as a PRD that a person reads and accepts, and every scenario in it becomes a test the agent has to pass and cannot edit.

Then the words. Eric Evans called it a ubiquitous language:[^5] one meaning per word, in conversation and in code. We define each concept once, in one place, and hold every repository to it.

Then the rules, which is where `voodoo.md` turns into a jig. A rule is worth nothing until it says how you find out you broke it. This blog's own repository has one:

> **A worktree is never inside a checkout.** Why: a tool that finds its project by looking upward — dune, for one — takes the outer checkout as the root, and builds and answers for `main` instead of the work. Symptom: `git worktree list` shows a path under a checkout.

An agent can run the symptom against its own work before anyone looks, and where the check can be automated, the rule moves into it, because an instruction can be ignored and a check cannot.[^6] That is what happened to my fascinating story: the writing rules say a scene comes from the author or the public record, and how to tell.

The best jigs leave the agent nothing to promise. It does not mark its own work done: the build, the tests and the checks run outside it, and the work counts only when they pass, with every refusal sent back to the agent with its reason. Each piece of work comes with the paths it may touch, and a write anywhere else is refused before anything changes. An agent asked not to touch a file can still touch it. One fenced in cannot.

Under everything sits the compiler, the one reviewer that never gets tired, never skims a diff on a Friday afternoon and cannot be talked round. Make illegal states unrepresentable, in Yaron Minsky's phrase,[^7] and a whole kind of mistake stops depending on anybody noticing it. Hypha's own principles say it as plainly: "Invalid states must be unrepresentable."[^principles] [Hypha Stack](https://hyphatech.io/stack) carries the same idea to the edges where systems usually break, with SQL checked against the database's schema and contracts checked where data crosses a boundary.

## We have been here before

Code written by a machine has been doubted before. When John Backus's team built FORTRAN in the 1950s, programmers had watched the early "automatic programming" systems produce code many times slower than their own, and few believed a machine could write it as well as they did. So the team made the efficiency of the code FORTRAN generated its first goal, ahead of the language itself.[^8] Nobody reads a compiler's output to decide whether to trust it, and nobody thinks less of the people who stopped.

Reviewing your agent's code line by line is a road to nowhere: agents write more than anyone can read, and a review is a judgement, never a proof. What I read is the jig. When a mistake gets through, I add a check, and that kind of mistake is gone for good.

When the jig is right, what comes out of it is shockingly good. It reads as if one careful person wrote it. It calls the same thing by the same name everywhere, returns its errors instead of throwing them, arrives with tests that were written first and seen failing, and changes its documents in the same commit as its behaviour. It is more consistent than anything I wrote by hand, because I was never that consistent for that long.

So build the jig, every boundary the work has to pass, from the first question to the type it has to fit. People specify, the system enforces, and that is where the engineering moved, out of the code. It is the part of the work that is still yours.

[^1]: [Andrej Karpathy on X, 2 February 2025.](https://x.com/karpathy/status/1886192184808149383)

[^2]: [Andrej Karpathy has renamed vibe coding](https://sdtimes.com/ai/andrej-karpathy-has-renamed-vibe-coding-heres-what-engineering-leaders-need-to-do-about-it/), SD Times, May 2026.

[^3]: Rich Hickey, ['AI' is Not a Tool](https://www.linkedin.com/pulse/ai-tool-rich-hickey-kjl8e), October 2026.

[^principles]: [Hypha's principles, 4.13.](https://hyphatech.io/principles#4.13)

[^jig]: [Jig (tool)](https://en.wikipedia.org/wiki/Jig_(tool)), Wikipedia.

[^4]: [mattpocock/skills](https://github.com/mattpocock/skills) on GitHub.

[^5]: Eric Evans, *Domain-Driven Design: Tackling Complexity in the Heart of Software*, Addison-Wesley, 2003.

[^6]: [Hypha's principles, 3.2.](https://hyphatech.io/principles#3.2)

[^7]: Yaron Minsky, [Effective ML Revisited](https://blog.janestreet.com/effective-ml-revisited/), Jane Street, 2011.

[^8]: John Backus, [The History of FORTRAN I, II, and III](https://softwarepreservation.computerhistory.org/FORTRAN/paper/p25-backus.pdf), ACM SIGPLAN History of Programming Languages, 1978.
