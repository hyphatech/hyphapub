1. I've watched review of an agent's code go three ways: you fight its composition and style by hand, you fill in the context the model lacks and watch what it does to the result, or you let pace win and merge without looking.
2. None of the three scales, because agents write more code than anyone can physically read.
3. The last is where everyone ends up, since no company moving at this speed can spend 24/7 on careful reviews.
4. Each merged PR can be perfectly fine on its own, yet together they turn into a mess no one can follow in full.
5. Then "production readiness" quietly stops meaning anything.
6. Review as we know it was built by humans for humans, on the idea that more eyes catch more mistakes.
7. Adding more AI to check the AI works to some extent, but it is a patchwork of shallow fixes that still have to be reviewed.
8. One more line in the agent's instructions only asks, and the agent is free to ignore it.
9. What keeps a mistake from coming back is a proper boundary, one the agent cannot cross however it was asked.
10. Trusting the output takes guarantees, not more eyes: complete and correct problem formalisation grounded in domain and cross-domain context, sound models, components, and abstractions, a compiler that eliminates a whole class of runtime problems, and an executable that uses limited resources efficiently.
