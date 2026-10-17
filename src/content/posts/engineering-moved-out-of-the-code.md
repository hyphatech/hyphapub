---
title: "Engineering moved out of the code"
date: 2026-10-16T12:00:00.000Z
description: "Using an agent doesn’t make you an agentic engineer though, and you are ready for this conversation."
author: roman
series: agentic-engineering
---

I drafted this post with an agent. Openings and closings are never easy, so I asked it to brainstorm a few. What I got back was a fascinating story that happened to me recently. Plausible, well made... and not mine. Absolutely fictional.

Plenty of engineers would take that as proof that an LLM can't be trusted with anything, and blame any code it wrote before reading a line of it. Most arguments about AI and code I hear run on that reflex. Meanwhile everyone who works with an agent thinks of themselves as a 10x engineer. Sometimes the result is real slop, vibe-coded shit nobody can follow. Other times the same kind of LLM-assisted work comes out clean and deliberate, the kind of code a senior engineer would put their name to. Both get called "AI-generated code", and the LLM is the only thing they have in common.

In February 2025 [Andrej Karpathy](https://karpathy.ai), who co-founded OpenAI and led AI at Tesla, named one of them: "There's a new kind of coding I call 'vibe coding', where you fully give in to the vibes, embrace exponentials, and forget that the code even exists."[^1] He meant weekend projects, and said so. The name escaped anyway, and came to cover every codebase nobody understands. A year later he gave the other activity its name, agentic engineering — designing the system and stating its constraints, then letting agents build what has already been reasoned through.[^2] He talked it through with Sequoia's Stephanie Zhan:

[Andrej Karpathy: From Vibe Coding to Agentic Engineering](https://www.youtube.com/watch?v=96jN2OCOfLs)

What they share is the setup — in both, a person asks and an agent writes the code. So the critics see an agent at the keyboard and conclude that nobody did any engineering, which is exactly true of vibe coding. Whether the other one is engineering at all is less clear.

## A tool is something you wield

[Rich Hickey](https://en.wikipedia.org/wiki/Rich_Hickey), widely known in narrow circles as the creator of [Clojure](https://clojure.org), argued that with an LLM you abdicate writing code. A tool is something you wield, held in the hand, under continuous control, telling you what it touches. An agent is none of that. You make a request and it acts on its own. "LLMs are not wielded. LLMs are automation."[^3] And the people trying to steer it, he says, end up "filling voodoo.md with just the right incantations", one software update away from everything they have learned being obsolete.

He is actually right, and most `AGENTS.md` files are `voodoo.md`, a page of pleading the model reads when it feels like it. "Follow the style guide." "Never swallow errors." "Make no mistakes this time."

But automation is old, and so is the answer to it. Nobody steers a lathe with incantations. You build a jig.

A jig is the dumbest object in a workshop. It cuts nothing. It controls where the work sits and where the tool goes, for "repeatability, accuracy, and interchangeability",[^jig] so the hundredth cut comes out like the first, whoever pushes the saw and however tired they are. What the shop knows lives in the jig, not in the operator's head, and the operator can change.

**Vibe coding makes requests of automation and hopes. Agentic engineering builds the jig the automation runs in, and checks every cut against it.**

## Building the jig

The cheapest part of the jig is made of questions, asked before any code exists. [Matt Pocock](https://www.mattpocock.com) has put a great deal of work into a method for agentic engineering, and his collection of agent skills is, in his words, what he uses "to do real engineering - not vibe coding".[^4] The place to start is his `/grilling`, in which the agent interviews you about the plan before anything is built, a round of questions at a time, each with the answer it would recommend, until every branch of the decision is resolved. What it leaves behind is a shared understanding. Written down as a PRD that a person reads and accepts, it turns every scenario into a test the agent has to pass as written.

![The plan opens into decisions, and the agent asks them in rounds. Each round puts the whole frontier to you, every decision whose prerequisites are settled, each with the answer the agent recommends. A fact it can look up is never asked, a sub-agent finds it, and only the decision that hangs on it waits. Each answer unblocks the decisions that depend on it, so the next round reaches further, until the frontier is empty and you confirm a shared understanding.](/images/engineering-moved-out-of-the-code/grilling-works-the-frontier.svg)

Then the words. Eric Evans called this a ubiquitous language,[^5] one meaning per word, in conversation and in code. We define each concept once, in one place, and hold every repository to it.

Then the rules, which is where `voodoo.md` turns into a jig. A rule is worth nothing until it says how you find out you broke it. The story the agent made up about me broke one of ours, and the rule said how to catch it. Our repositories share another:

> **A worktree is never inside a checkout.** Why: a tool that finds its project by looking upward — dune, for one — takes the outer checkout as the root, and builds and answers for `main` instead of the work. Symptom: `git worktree list` shows a path under a checkout.

An agent can run the symptom against its own work before anyone looks, and where the check can be automated, the rule moves into it, because an instruction can be ignored and a check cannot.[^6]

The best jigs leave the agent nothing to promise. It does not mark its own work done. The build, the tests and the checks run outside it, and the work counts only when they pass, with every refusal sent back to the agent with its reason. Each piece of work comes with the paths it may touch, and a write anywhere else is refused before anything changes. An agent asked not to touch a file can still touch it. One fenced in cannot.

The strictest part of the jig is the compiler, the one reviewer that never gets tired, never skims a diff on a Friday afternoon and cannot be talked round. When the types make an illegal state impossible to write,[^7] a whole kind of mistake no longer depends on anyone noticing it. [Hypha Stack](https://hyphatech.io/stack) takes that to the edges where systems usually break.

## We have been here before

Code written by a machine has been doubted before. When John Backus's team built FORTRAN in the 1950s, programmers had watched the early "automatic programming" systems produce code many times slower than their own, and few believed a machine could write it as well as they did. So the team made the efficiency of the code FORTRAN generated its first goal, ahead of the language itself.[^8] Nobody reads a compiler's output to decide whether to trust it, and nobody thinks less of the people who stopped.

Reviewing your agent's code line by line is [a road to nowhere](/more-eyes-wont-save-you), because agents write more than anyone can read, and a review is a judgement, never a proof. What I read is the jig. When a mistake gets through, I add a check, and that kind of mistake is gone for good.

When the jig is right, what comes out of it is shockingly good. It reads as if one careful person wrote it. It calls the same thing by the same name everywhere, returns its errors instead of throwing them, arrives with tests that were written first and seen failing, and changes its documents in the same commit as its behaviour. It is more consistent than anything I wrote by hand.

People specify, the system enforces, and that is where the engineering moved, out of the code. It is the part of the work that is still yours.

[^1]: [Andrej Karpathy on X, 2 February 2025.](https://x.com/karpathy/status/1886192184808149383)

[^2]: [Andrej Karpathy has renamed vibe coding](https://sdtimes.com/ai/andrej-karpathy-has-renamed-vibe-coding-heres-what-engineering-leaders-need-to-do-about-it/), SD Times, May 2026.

[^3]: Rich Hickey, ['AI' is Not a Tool](https://www.linkedin.com/pulse/ai-tool-rich-hickey-kjl8e), October 2026.

[^jig]: [Jig (tool)](https://en.wikipedia.org/wiki/Jig_(tool)), Wikipedia.

[^4]: [mattpocock/skills](https://github.com/mattpocock/skills) on GitHub.

[^5]: Eric Evans, *Domain-Driven Design: Tackling Complexity in the Heart of Software*, Addison-Wesley, 2003.

[^6]: [Hypha's principles, 3.2.](https://hyphatech.io/principles#3.2)

[^7]: Yaron Minsky, [Effective ML Revisited](https://blog.janestreet.com/effective-ml-revisited/), Jane Street, 2011.

[^8]: John Backus, [The History of FORTRAN I, II, and III](https://softwarepreservation.computerhistory.org/FORTRAN/paper/p25-backus.pdf), ACM SIGPLAN History of Programming Languages, 1978.
