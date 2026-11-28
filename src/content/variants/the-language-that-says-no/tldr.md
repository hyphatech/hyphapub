1. In Robin Milner's LCF a proof tactic could be clever, sloppy or plain wrong, and still could not hand him a false theorem, because the types allowed no such value to be built.
2. Fifty years on, the one up all night at the computer is an agent, and it cuts corners.
3. The language Milner designed for those tactics was ML, and OCaml is what it grew into.
4. In 1978 Milner proved that a program his type checker accepted could not "go wrong", with every type inferred and no annotations needed.
5. People built with OCaml things that had to be right, from the analyser that proved the Airbus A340's flight control software free of run-time errors to the systems Jane Street runs on.
6. The language was ready long before its ecosystem, which was split for years between incompatible standard libraries, build systems and concurrency libraries.
7. For those years the ecosystem was what people judged OCaml by.
8. Making a mature runtime parallel is hard, and the OCaml team spent more than eight years on it before OCaml 5 shipped parallelism and algebraic effects in December 2022.
9. A type writes an assumption about data down where a machine can check it.
10. A language without types keeps its assumptions in the programmer's head, and finds a wrong one when the program runs, in front of whoever is using it.
11. That stops working when code is large, old or changed by someone who was never told, which describes most code an agent touches.
12. A type can describe a value or bind it, and only a binding type is one the program cannot break, whatever code anyone writes.
13. TypeScript strips its types out before the code runs, and its design goals list a sound type system among the non-goals.
14. One value typed "any" spreads through every value it touches, so a TypeScript codebase is as strict as its least careful line.
15. Python's types are hints, checked by separate tools with their own rules, and only if somebody runs them.
16. A type that describes is advice, and an agent takes advice the way it takes instructions.
17. A type that binds is a check, and a check cannot be ignored.
18. When a new state is added to a type in OCaml, the compiler finds the function nobody opened and names the case it misses, and Dune makes that an error in development builds.
19. TypeScript catches the same miss only where someone remembered a workaround, Python only when a separate checker runs in strict mode, and Go has no such types at all.
20. OCaml has no null, and a value that might not be there has to be opened before it is touched.
21. In TypeScript, Python and Rust, async colours a function, so when one function starts waiting, every caller up to main has to change.
22. OCaml 5's algebraic effects let a function ask for something and a handler up the stack answer, with nothing marked in between.
23. With Eio, a lookup can move to a database without the function that calls it changing by a character.
24. Effects also bring OCaml close to having dependency injection in the language, and keep debuggers and profilers working on code that waits.
25. TypeScript's Effect library builds on the same idea, but as a library its code is a boundary of its own, another colour.
26. For an agent it is the difference between a change and a cascade through files it was never asked to open.
27. Rust solves memory safety, at the price of an ownership model that spends an agent's effort and the compiler's refusals on memory rather than on the domain.
28. Rust compiles slowly, with 55% of those answering its own survey waiting more than ten seconds for an incremental rebuild.
29. An agent works in a loop of changes and compiler feedback, and the OCaml compiler keeps that loop short.
30. Of the six languages compared, every one traded something away, and OCaml traded the least.
31. OCaml reads like what it means, with every module's contract in an interface file and every state named in a type.
32. Jane Street made the biggest bet on it, with more than thirty million lines of OCaml written by over five hundred people.
33. Models have read far less OCaml, yet by Xavier Leroy's account they write it decently, and a type system seems to help them.
34. Where a model gets it wrong, the compiler tells it so on its first try, while in a language that describes, the mistake waits for a user to find it.
35. Writing code gets cheaper, and checking that it is correct does not.
36. A type checker is the cheapest check there is.
37. OCaml's problem was never a lack of libraries so much as a lack of ones that fit together.
38. Most OCaml libraries were written before effects, so an ecosystem that uses OCaml 5 in full has to be built for it.
39. [Hypha Stack](https://hyphatech.io/stack) is built to be that ecosystem, components made to fit together.
40. In it a type described once holds the server and the front end together, so a server change the front end has not caught up with is a compile error, not a broken page.
41. SQL gets the same treatment, as every statement is checked against the migrated database before anything ships.
42. Milner did not ask anyone to be more careful, and built a language in which the careless thing could not be written.
43. An agent will stay up all night writing code, and it should, in a language that says no.
