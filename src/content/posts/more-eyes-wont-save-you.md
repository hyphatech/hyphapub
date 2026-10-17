---
title: "More eyes won’t save you"
date: 2026-10-15T12:00:00.000Z
description: "Code review was built by humans for humans, on the idea that more eyes catch more mistakes. Then agents started writing the code."
author: roman
series: agentic-engineering
---

I've watched it go three ways:

1. If you really care and know how you'd write the code yourself, you spend the PR review fighting the composition and style, enforcing by hand all those habits you've built over the years.
2. If you hold the wider picture in your head, including the agreements and systems the model isn't aware of, you identify the gaps, provide the missing context, and monitor how it affects the result.
3. If the pace of delivery has already won, you stop looking at the size of the PR, sometimes even at CI feedback itself. Bypass + merge asap to get that shit done!

In all three cases, it's another prompting session → agentic work in worktrees → slow and flaky CI → another review iteration. Repeat.

None of these approaches scales, and the last one is where everyone ends up, because agents write more code than anyone can physically read, and no company moving at this speed can spend 24/7 on careful reviews.

Moreover, each merged PR can be perfectly fine on its own. But together, they turn into a mess no one can follow in full, and "production readiness" quietly stops meaning anything.

The trouble is that the review process as we know it was built by humans for humans, based on the idea that "more eyes catch more mistakes" — an attempt to collectively overcome our cognitive limitations. Maybe we could just add more AI to that AI to keep things aligned? This brilliant idea works to some extent, but appears to be little more than a patchwork of shallow fixes that still have to be reviewed. Prompting → worktrees → slow and flaky CI. Repeat. Deploy. Feel free to use that MCP to figure out why the latest change is now producing two more runtime errors and why they affect the whole system, all of a sudden.

So you add one more line to `AGENTS.md`, something like "think about the whole system before you change anything, you piece of crap", and hope the model takes it to heart next time. Prompting quality, you know.

But a prompt only asks, and the agent is free to ignore it. What keeps that mistake from coming back is a proper boundary, one the agent cannot cross however it was asked.

Trusting the output takes guarantees, not more eyes: complete and correct problem formalisation grounded in domain and cross-domain context, sound models, components, and abstractions, a compiler that eliminates a whole class of runtime problems, and an executable that uses limited resources efficiently.
