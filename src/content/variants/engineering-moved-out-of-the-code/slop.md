Let's be honest: I drafted this post with an AI agent. 🤖

Openings and closings are never easy—so I asked it to brainstorm a few. And what did I get back? A fascinating story that had supposedly happened to me recently. Plausible. Well made. And... not mine. Absolutely fictional. 😅

Here's the thing—plenty of engineers would take that as proof that an LLM can't be trusted with *anything*, and blame any code it wrote before reading a single line of it. Most of the arguments about AI and code I hear run on exactly that reflex.

Meanwhile, everyone who works with an agent thinks of themselves as a 10x engineer. 🚀

## 🎭 Two Very Different Realities

The truth is, "AI-generated code" isn't one thing. It's two.

- **The slop:** sometimes the result is real slop—vibe-coded shit nobody can follow.
- **The craft:** other times, the same kind of LLM-assisted work comes out clean and deliberate—the kind of code a senior engineer would put their name to.

Both get called "AI-generated code." And the LLM? It's the *only* thing they have in common.

## 🧠 From Vibes to Engineering

Picture this: it's February 2025. [Andrej Karpathy](https://karpathy.ai)—who co-founded OpenAI and led AI at Tesla—names one of them:

> "There's a new kind of coding I call 'vibe coding', where you fully give in to the vibes, embrace exponentials, and forget that the code even exists."

(You can find it in [Andrej Karpathy on X, 2 February 2025.](https://x.com/karpathy/status/1886192184808149383))

He meant weekend projects—and said so. But the name escaped anyway, and came to cover every codebase nobody understands.

Fast forward a year. Karpathy gave the other activity its name: **agentic engineering**—designing the system and stating its constraints, then letting agents build what has already been reasoned through. (As SD Times reported in May 2026: [Andrej Karpathy has renamed vibe coding](https://sdtimes.com/ai/andrej-karpathy-has-renamed-vibe-coding-heres-what-engineering-leaders-need-to-do-about-it/).) He talked it through with Sequoia's Stephanie Zhan:

[Andrej Karpathy: From Vibe Coding to Agentic Engineering](https://www.youtube.com/watch?v=96jN2OCOfLs)

What do they share? The setup. In both, a person asks and an agent writes the code.

So the critics see an agent at the keyboard and conclude that nobody did any engineering—which is *exactly* true of vibe coding. But whether the other one is engineering at all? That's less clear. 🤔

## 🔧 A Tool Is Something You Wield

[Rich Hickey](https://en.wikipedia.org/wiki/Rich_Hickey)—widely known in narrow circles as the creator of [Clojure](https://clojure.org)—argued that with an LLM, you abdicate writing code.

His reasoning is compelling. A tool is something you wield:

- ✋ Held in the hand
- 🎛️ Under continuous control
- 📢 Telling you what it touches

An agent is none of that. You make a request, and it acts on its own. In his words: "LLMs are not wielded. LLMs are automation." (From Rich Hickey, ['AI' is Not a Tool](https://www.linkedin.com/pulse/ai-tool-rich-hickey-kjl8e), October 2026.)

And the people trying to steer it? They end up, he says, "filling voodoo.md with just the right incantations"—one software update away from everything they have learned being obsolete.

## 🪄 The Uncomfortable Truth About AGENTS.md

He is actually right. Most `AGENTS.md` files *are* `voodoo.md`—a page of pleading the model reads when it feels like it:

- "Follow the style guide."
- "Never swallow errors."
- "Make no mistakes this time."

Sound familiar? 👀

But here's what most people miss: automation isn't new. And neither is the answer to it.

Nobody steers a lathe with incantations. You build a jig. 🪚

## 📐 Why the Humble Jig Changes Everything

A jig is the dumbest object in a workshop. It cuts nothing.

What it does is control where the work sits and where the tool goes—for "repeatability, accuracy, and interchangeability" (as Wikipedia's [Jig (tool)](https://en.wikipedia.org/wiki/Jig_(tool)) puts it). That way, the hundredth cut comes out like the first—whoever pushes the saw, and however tired they are.

What the shop knows lives in the jig, not in the operator's head. And the operator can change.

**The lesson is clear:** Vibe coding makes requests of automation and hopes. Agentic engineering builds the jig the automation runs in—and checks every cut against it. ✨

## 🛠️ Building the Jig, Step 1: Ask the Right Questions ❓

The cheapest part of the jig is made of questions—asked before any code exists.

[Matt Pocock](https://www.mattpocock.com) has put a great deal of work into a method for agentic engineering, and his collection of agent skills ([mattpocock/skills](https://github.com/mattpocock/skills) on GitHub) is, in his words, what he uses "to do real engineering - not vibe coding".

The place to start? His `/grilling`. Here's how it works:

- The agent interviews you about the plan *before* anything is built
- It asks a round of questions at a time
- Each question comes with the answer it would recommend
- It keeps going until every branch of the decision is resolved

What it leaves behind isn't just a plan. It's a shared understanding. Written down as a PRD that a person reads and accepts, it turns every scenario into a test the agent has to pass as written. ✅

![The plan opens into decisions, and the agent asks them in rounds. Each round puts the whole frontier to you, every decision whose prerequisites are settled, each with the answer the agent recommends. A fact it can look up is never asked, a sub-agent finds it, and only the decision that hangs on it waits. Each answer unblocks the decisions that depend on it, so the next round reaches further, until the frontier is empty and you confirm a shared understanding.](/images/engineering-moved-out-of-the-code/grilling-works-the-frontier.svg)

## 📖 Step 2: Speak One Language

Then come the words. Eric Evans called this a *ubiquitous language*—one meaning per word, in conversation and in code. (💡 Pro tip: it comes from Eric Evans, *Domain-Driven Design: Tackling Complexity in the Heart of Software*, Addison-Wesley, 2003.)

We define each concept once, in one place, and hold every repository to it.

## 📏 Step 3: Write Rules That Actually Work

Then the rules—and this is where `voodoo.md` truly transforms into a jig.

Here's the key insight: a rule is worth nothing until it says how you find out you broke it.

Remember that story the agent made up about me? It broke one of ours—and the rule said how to catch it. Our repositories share another:

> **A worktree is never inside a checkout.** Why: a tool that finds its project by looking upward — dune, for one — takes the outer checkout as the root, and builds and answers for `main` instead of the work. Symptom: `git worktree list` shows a path under a checkout.

An agent can run the symptom against its own work before anyone looks. And where the check can be automated, the rule moves into it—because an instruction can be ignored, and a check cannot. (This is straight from [Hypha's principles, 3.2.](https://hyphatech.io/principles#3.2))

## 🚧 Step 4: Leave Nothing to Promise

The best jigs leave the agent nothing to promise. It doesn't mark its own work done.

- **External verification:** the build, the tests and the checks run outside it
- **Pass or nothing:** the work counts only when they pass
- **Feedback loops:** every refusal goes back to the agent, with its reason
- **Hard boundaries:** each piece of work comes with the paths it may touch, and a write anywhere else is refused before anything changes

An agent asked not to touch a file can still touch it. One fenced in cannot. 🔒

## ⚙️ Step 5: Let the Compiler Do the Heavy Lifting

The strictest part of the jig is the compiler. It's the one reviewer that:

- Never gets tired
- Never skims a diff on a Friday afternoon
- Cannot be talked round

When the types make an illegal state impossible to write (an idea Yaron Minsky laid out in [Effective ML Revisited](https://blog.janestreet.com/effective-ml-revisited/), Jane Street, 2011), a whole kind of mistake no longer depends on anyone noticing it.

[Hypha Stack](https://hyphatech.io/stack) takes that to the edges where systems usually break. 💪

## 📜 We Have Been Here Before

This isn't the first time code written by a machine has been doubted.

When John Backus's team built FORTRAN in the 1950s, programmers had watched the early "automatic programming" systems produce code many times slower than their own. Few believed a machine could write it as well as they did.

So what did the team do? They made the efficiency of the code FORTRAN generated its *first* goal—ahead of the language itself. (Source: John Backus, [The History of FORTRAN I, II, and III](https://softwarepreservation.computerhistory.org/FORTRAN/paper/p25-backus.pdf), ACM SIGPLAN History of Programming Languages, 1978.)

Today? Nobody reads a compiler's output to decide whether to trust it. And nobody thinks less of the people who stopped.

## 🛑 Stop Reviewing Every Line

Reviewing your agent's code line by line is [a road to nowhere](/more-eyes-wont-save-you/). Why? Because agents write more than anyone can read—and a review is a judgment, never a proof.

What do I read instead? The jig.

When a mistake gets through, I add a check. And that kind of mistake? Gone for good. 🎯

## 🌟 The Payoff

When the jig is right, what comes out of it is shockingly good. It reads as if one careful person wrote it. It:

- ✅ Calls the same thing by the same name everywhere
- ✅ Returns its errors instead of throwing them
- ✅ Arrives with tests that were written first and seen failing
- ✅ Changes its documents in the same commit as its behavior

It's more consistent than anything I wrote by hand.

## 🔑 Key Takeaways

1. **"AI-generated code" is two things.** Vibe coding and agentic engineering share only the setup.
2. **An agent is automation, not a tool.** And automation needs a jig, not incantations.
3. **Rules need symptoms.** A rule is worth nothing until it says how you find out you broke it.
4. **Checks beat instructions.** An instruction can be ignored. A check cannot.
5. **Read the jig, not the code.** Every mistake that gets through becomes a check.

## In Conclusion

At the end of the day, the future of software isn't about whether an agent wrote the code—it's about where the engineering lives. People specify. The system enforces. And that is where the engineering moved: out of the code.

It is the part of the work that is still yours. 🙌

What do you think? Are you building jigs or writing voodoo.md? Drop your thoughts in the comments 👇

#AgenticEngineering #VibeCoding #SoftwareEngineering #AI #DeveloperExperience
