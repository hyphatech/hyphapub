---
title: "The language that says no"
date: 2026-10-21T12:00:00.000Z
description: "Your agent will cut a corner tonight. Whether that corner ships depends on the language you gave it."
author: roman
series: agentic-engineering
---

In the 1970s [Robin Milner](https://en.wikipedia.org/wiki/Robin_Milner), a computer scientist at the University of Edinburgh, was working on [LCF](https://en.wikipedia.org/wiki/Logic_for_Computable_Functions), a program to check mathematical proofs, and it became one of the three achievements his Turing Award named in 1991. Asked about it in a [2003 interview](http://users.sussex.ac.uk/~mfb21/interviews/milner/), he described a night at the computer:

> So if you stayed late at night working out a proof with the computer, you wouldn't have to think afterwards "gosh, did I cut a few corners?", because the LCF system just wouldn't have allowed you to do so!

Fifty years on, the one up all night at the computer is an agent, and it cuts corners.

In LCF, proofs were driven by small programs Milner called "tactics", which could be clever, sloppy or plain wrong. A theorem was an abstract type, `thm`, whose only operations were the rules of inference, and "strict typechecking then ensured that the only values that could be created were those that could be obtained from axioms by applying a sequence of inference rules – namely theorems."[^gordon] A tactic could fail, loop or give up, and still could not hand you a false theorem, because no such value could be built. The language he designed to write the tactics in was called ML, the MetaLanguage, and OCaml is what it grew into.

## From LCF to OCaml

ML outlived the prover it was made for. In 1978 Milner proved that a program his type checker accepted could not "go wrong", and the checker needed no annotations, because it inferred every type itself.[^types1978] His Turing Award named ML too, as "the first language to include polymorphic type inference together with a type-safe exception-handling mechanism".[^turing]

At INRIA, Gérard Huet's team took ML in its own direction and released Caml in 1987. Xavier Leroy rewrote it as Caml Light in 1990, gave it a native compiler and a module system in 1995, and with Didier Rémy and Jérôme Vouillon's objects it became Objective Caml in 1996, OCaml for short, in which one program can be functional, imperative and object-oriented at once.[^history]

[Creator of OCaml: Functional Programming, Formal Verification, Programming Languages | Xavier Leroy](https://www.youtube.com/watch?v=9Cswiqrq6So)

People started building with it things that had to be right. In 2003 Astrée, an analyser written in OCaml at the École normale supérieure, proved that the primary flight control software of the Airbus A340, 132,000 lines of C, could never stop on a run-time error, and Airbus took it on for the A380.[^astree] Jane Street, the trading firm that would grow into Wall Street's leading market maker, began writing its systems in OCaml in the early 2000s.[^jane-early] Facebook wrote the type checkers for Hack and Flow in it, and Infer, which checks every change to its mobile apps before it ships.[^facebook] Fun fact, the first Rust compiler was written in OCaml too, until Rust could compile itself in 2011,[^rust] and so is the reference interpreter of WebAssembly.[^wasm]

What grew around the language took a different path. Its community came mostly from universities, research labs and companies where guarantees mattered more than anything else, and each built the tools it needed. For years OCaml had two standard libraries, several build systems, a few quite different ways to compile to JavaScript, and two concurrency libraries incompatible with each other, which left "a split OCaml world with almost no interoperability, and duplication of efforts", as one of their users put it in 2014.[^split] The language was ready long before its ecosystem, and for years the ecosystem was what people judged it by.

Meanwhile the language kept moving. Until version 5, OCaml, like many other languages at the time, was multi-threaded but single-core, because its runtime, garbage collector included, "was really designed with sequential executions in mind".[^leroy-gc]

Making a runtime truly parallel is hard in itself. The garbage collector has to keep working while many threads change memory at once, and stay fast, since the easy way out, a lock around every operation on memory, would make a program "run as slowly as on a single processor".[^leroy-lock] The language also needs a memory model that says what a program may see when two threads touch the same data, every choice trading speed against simplicity.[^memory]

Doing it to a mature language is harder still, because the millions of lines already written must keep working, and keep their speed.[^parallel] The OCaml team, most of it at OCaml Labs in Cambridge, spent more than eight years on it. OCaml 5 came out in December 2022 with parallelism across cores and algebraic effects.[^ocaml5]

## What is a type

All of that rests on the one thing Milner put in first, the type, and the word is used loosely enough to need pinning down before anything leans on it.

The idea is older than computers. Bertrand Russell sketched a theory of types in 1903 and set it out in 1908, to keep mathematics out of its paradoxes by sorting things into kinds that cannot be mixed, and in 1940 Alonzo Church gave it the form programming languages later borrowed.[^russell] A type in a program does the same job. It says what kind of thing a value is, and so what can be done with it.

Every program makes assumptions about its data. This value is a number, that list is never empty, a payment is in one of four states. A type writes such an assumption down where a machine can check it. A language without types still has the assumptions, keeps them in the programmer's head, and finds out one was wrong when the program runs, in front of whoever is using it. That works while the person who made the assumptions is the one changing the code. It stops working when the code is large, or old, or changed by someone who was never told, and that describes most code an agent touches.

Types can do that job in two ways. A type can describe a value or bind it. A binding type is one the program cannot break, whatever code anyone writes, the way a binding contract is one you cannot walk away from when it gets inconvenient. A describing type is the program's own account of itself, and nothing makes it true.

The two languages most of us write are Python and TypeScript.[^survey] In both, the types came afterwards, written on top of a language that runs without them.

JavaScript was made in 1995 so that anyone could write a few lines straight into a web page,[^js] and for years those lines mostly made text scroll and snow fall. Then it grew into the language of every web application, with nothing to hold one together. TypeScript is the most successful attempt to fix that. It is JavaScript with types written in, and its compiler checks them and then strips them out, so what runs is plain JavaScript that knows nothing of them. To work with whatever JavaScript was already there, its design goals promise to "preserve runtime behavior of all JavaScript code" and keep the types "fully erasable", and they list a sound type system among the non-goals.[^ts-goals] So every type can be opted out of, and the way out is `any`. A value of type `any` can be called, assigned and read from as anything, and whatever is read from it is `any` too,[^any] so one `any` spreads quietly through every value it touches. `JSON.parse` returns one, and this compiles without a word:

```ts
function chargeCard(customerId: string, amount: number) { ... }

const shipping = 5;
const order = JSON.parse(body);        // any
const total = order.total + shipping;  // any too, and the API sent "49.90"
chargeCard(order.customerId, total);   // accepted as a number, charges "49.905"
```

A TypeScript codebase is as strict as its least careful line, and at worst it is JavaScript with annotations.

Python was never about types. Guido van Rossum started it in December 1989 as a hobby project for the Christmas week,[^guido] and it grew up as a language for prototypes, scripts and science long before anyone asked it to hold a large system together. Types arrived in 2014 as hints, with the promise that "Python will remain a dynamically typed language, and the authors have no desire to ever make type hints mandatory, even by convention".[^pep484] What checking there is lives in separate tools, mypy and pyright, each with its own rules, and only if somebody runs them.

**A type that describes is advice, and an agent takes advice the way it takes instructions. A type that binds is a check, and a check cannot be ignored.**

## What the compiler refuses

Now OCaml. Take a payment. It is pending, paid, refunded or disputed, and each state carries only what belongs to it:

```ocaml
type payment =
  | Pending
  | Paid of { amount : int; receipt : string }
  | Refunded of { amount : int; reason : string }
  | Disputed of { amount : int; case_id : string }
```

Only a paid payment has a receipt, and there is no way to write a refund without its reason. Disputes came last, and somebody forgot the one function that decides whether a payment can be refunded:

```ocaml
let can_refund = function
  | Paid _ -> true
  | Pending | Refunded _ -> false
```

```
Warning 8 [partial-match]: this pattern-matching is not exhaustive.
  Here is an example of a case that is not matched: Disputed _
```

The compiler finds the function nobody opened and names the case it misses. It reports it as a warning, and Dune, OCaml's build tool, turns the warning into an error in development builds,[^dune-profiles] so nothing builds until every such function has been handled. TypeScript catches it only in a switch whose author remembered to add a workaround for it, Python only when a separate checker runs in strict mode, and Go has no such types at all.[^exhaustive]

There is no null either. Tony Hoare added the null reference to ALGOL W in 1965, "simply because it was so easy to implement", and later called it his billion-dollar mistake.[^hoare] Java still pays it on every reference. Go pays it twice, since an interface holding a nil pointer is not itself nil, and its FAQ has a whole entry on why "my nil error value" is not equal to nil.[^go-nil] In OCaml a `user` is always a user, and a user who might not be there is a `user option`, which the compiler makes you open before you touch it.

## Effects

A program spends much of its life waiting, for a database, the network, a disk. The simplest way to wait is to block, to stop the thread until the answer comes, and most web frameworks did just that for years, one thread per request, which holds up until there are more requests than threads a machine can afford. The other way is an event loop, one thread that never waits and juggles thousands of requests, starting each piece of I/&#8288;O and coming back to it when it is done.

`async` and `await` are how TypeScript, Python and Rust let ordinary-looking code run on that loop. They tell the compiler where a function may pause and hand the thread back to the loop, and they do nothing else, so one blocking call inside an `async` function still stalls everything else on it. And the marks spread. Bob Nystrom called it in 2015 "the colour of a function", because an `async` function can only be awaited from another `async` one.[^colour] Here is a greeting built on a lookup that reads from memory:

```ts
function findUser(id: number): User { ... }

function greet(id: number): string {
  return `Hello, ${findUser(id).name}`;
}

function welcome(id: number): string {
  return `<h1>${greet(id)}</h1>`;
}
```

The lookup moves to a database and becomes `async`, and `greet` stops compiling, because what comes back is no longer a user:

```
Property 'name' does not exist on type 'Promise<User>'.
```

So `greet` becomes `async`, then `welcome`, then whatever calls `welcome`, all the way up:

```ts
async function findUser(id: number): Promise<User> { ... }

async function greet(id: number): Promise<string> {
  return `Hello, ${(await findUser(id)).name}`;
}

async function welcome(id: number): Promise<string> {
  return `<h1>${await greet(id)}</h1>`;
}
```

One function started waiting and three changed. Libraries split the same way, one kind for code that waits and one for code that doesn't, and in Rust it runs deep enough that its language team opened an initiative in 2022 to let one function be both.[^keyword-generics]

OCaml 5 has a different answer, from programming language research, called algebraic effects.[^plotkin] A function can perform an effect, a request it does not answer itself, and a handler somewhere up the stack answers it and resumes the function exactly where it stopped, like an exception that can come back with a value:

```ocaml
(* Declare an effect: a question whose answer is a string. *)
type _ Effect.t += Ask_name : string Effect.t

(* greet asks the question and carries on with the answer. *)
let greet () = "Hello, " ^ Effect.perform Ask_name

let () =
  match greet () with
  (* greet finished: print what it returned. *)
  | greeting -> print_endline greeting
  (* greet asked for a name: k is the rest of greet, paused there.
     Resume it with the answer. *)
  | effect Ask_name, k -> Effect.Deep.continue k "Robin"
```

`greet` asks for a name without knowing who answers. Here the handler answers "Robin". A test could answer with a fixture, and a scheduler could answer "not yet", put `greet` aside, run something else, and come back once the name arrives from a database. Generators, coroutines, lightweight threads and `async` itself can all be built this way, as libraries, with nothing marked in between.[^retrofit]

That one mechanism does more than end the colours. Code asks, and the handler around it decides, so what other languages need a dependency injection framework for comes close to being a property of the language. And a paused function keeps a real stack of its own, so the debuggers and profilers that walk the stack keep working on code that waits.[^retrofit-stack]

TypeScript has an ambitious library after the same idea, Effect, where a program is a value of type `Effect<Success, Error, Requirements>`, "a description of a workflow or operation that is lazily executed", which tracks in its types the errors and dependencies OCaml leaves untyped.[^effect-ts] It is a library on top of the language, though, so the code that uses it is written as Effect values, in generators or pipelines, and calling it from plain TypeScript is a boundary of its own, another colour. OCaml has effects in the language itself, so a function that uses one is written like any other function, and the functions that call it do not change.

Eio is the library that puts effects to work for I/&#8288;O and concurrency in OCaml 5.[^eio] It sets a waiting function aside and runs others until its answer arrives, so the lookup can move to a database and `greet` does not change by a character:

```ocaml
let greet db id = "Hello, " ^ (Users.find db id).name
```

and running two lookups at once is a function call, not a new kind of function:

```ocaml
let profile db id =
  let user, orders =
    Eio.Fiber.pair
      (fun () -> Users.find db id)
      (fun () -> Orders.recent db id)
  in
  { user; orders }
```

For an agent it is the difference between a change and a cascade. Making one function talk to the network touches that one function in OCaml, and in a coloured language it touches every caller up to `main`, in files the agent was never asked to open. OCaml is one of very few languages with effects built in, and the research behind them is still moving.[^modal-effects]

## What the others traded

Rust stands apart, and for good reason. It was made to solve the memory safety problem, and it solves it.[^rust-why] The price is an ownership model the engineer works out and the compiler enforces, who owns each value, who may borrow it and for how long. Leroy calls it "the finest language that I know for manual memory management", and that is its trade, since "it's significantly harder to write programs when you have to manage your memory".[^leroy-rust] It shows in the code. Here is a cache of users in Rust:

```rust
fn remember(cache: &Rc<RefCell<HashMap<u64, Rc<User>>>>, user: User) -> Rc<User> {
    let user = Rc::new(user);
    cache.borrow_mut().insert(user.id, Rc::clone(&user));
    user
}
```

The same in OCaml:

```ocaml
let remember cache user =
  Hashtbl.replace cache user.id user;
  user
```

Every word Rust adds is about memory, and none of it is about users. An agent writing Rust spends its effort, and the compiler its refusals, on the machinery rather than on the domain. Rust's own survey found that 55% of those who answered wait more than ten seconds for an incremental rebuild of their slowest project, and compile times were among the reasons given by 45% of those who stopped using it.[^rust-survey] An agent works in a loop, a change and the compiler's feedback, many times over, and the OCaml compiler keeps that loop short. What it builds is predictable too, so you know before it runs what will be fast and what will be slow.[^leroy-cost]

![Six languages against six properties of their types. Java checks every case since version 21, has null, is sound, infers only local types, collects garbage and has no async colours since its virtual threads. TypeScript checks every case only with a manual idiom, keeps null out only under a flag, is unsound by design, infers locally, collects garbage and colours functions with async. Python has none of the checks, collects garbage and colours functions with async. Go has no variant types, has nil, is sound, infers only locals, collects garbage and has no colours. Rust checks every case, has no null, is sound, infers inside function bodies, manages memory through ownership instead of a collector, and colours functions with async. OCaml has all six.](/images/the-language-that-says-no/six-languages.svg)

Every one of them traded something away, and OCaml traded the least. It reads like what it means. Every module has its contract in an interface file, every state is named in a type, so nobody has to read the code, and anybody can.

## Who bet on it

The biggest bet is Jane Street's. Its people made it "the world's largest industrial user of the language",[^rwo] with more than thirty million lines of OCaml written by over five hundred people,[^jane-scale] and Reuters reported a record $39.6 billion of net trading revenue for it in 2025, calling it "Wall Street's leading market maker".[^reuters] What it wants from OCaml is speed, reliability and code that people who are not programmers can read, "like financial engineers or quantitative analysts".[^leroy-jane] It gives back in kind. Jane Street is a platinum sponsor of the OCaml Software Foundation,[^ocsf] funds work on the compiler,[^ocamlpro] and Yaron Minsky, who brought OCaml there and heads its technology group, co-wrote Real World OCaml, the book on using it in production, which anyone can read online.[^rwo-book]

Bloomberg built BuckleScript, a compiler from OCaml to JavaScript, in 2016,[^bucklescript] and Melange carried it on inside the OCaml world when BuckleScript became ReScript.[^melange] Ahrefs, the SEO company, crawls the whole web every day with OCaml on more than four thousand servers,[^ahrefs] and in 2023 it moved all of its front ends to Melange as well.[^ahrefs-melange] MirageOS builds unikernels in OCaml, each an operating system made of only the libraries one application needs, and Docker's networking on Mac and Windows came from it.[^docker] Owl, begun at the University of Cambridge in 2016, does scientific and engineering computing in OCaml.[^owl]

The objection that matters for agents is that models have read far less OCaml than TypeScript or Python, and Jane Street trains its own for that reason.[^jane-ai] Leroy's latest feedback is that the OCaml models write is "quite decent and quite similar in quality to more popular languages", and that "one thing that seems to help the generative AI is a type system".[^leroy-llm] Where a model does get it wrong, the compiler tells it so on its first try. In a language that describes, the same mistake gets through and waits for a user to find it.

Writing code gets cheaper, and checking that it is correct does not.[^leroy-slop] A type checker is the cheapest check there is.

## One language to rule them all

OCaml's problem was never a lack of libraries so much as libraries that fit together. A library that made its own choices about errors, JSON or time makes every one around it translate. A coherent ecosystem is what matters, and it is why Jane Street built its own, with its own standard library, its own concurrency and its own build tool, which became Dune, the one most OCaml projects build with.[^jane-world]

OCaml 5 adds a second problem to the first. Effects are new, so most OCaml libraries were written before them and do not use them. Eio could only exist once OCaml 5 did. An ecosystem that uses OCaml 5 in full has to be built for it.

And we build one — [Hypha Stack](https://hyphatech.io/stack), components made to fit together. [Spindle](https://hyphatech.io/stack/spindle) serves the API over HTTP, [wiretype](https://hyphatech.io/stack/wiretype) describes its data once, [rowtype](https://hyphatech.io/stack/rowtype) and [postgres-eio](https://hyphatech.io/stack/postgres-eio) put that data in Postgres, [spool](https://hyphatech.io/stack/spool) runs the jobs, and [solidtype](https://hyphatech.io/stack/solidtype) builds the UI, to name a few.

Look at how little it takes. A line of an order, as wiretype's own example has it:

```ocaml
type line = {
  sku : string;
  quantity : int; [@min 1] [@max 99]
  note : string option; [@max_length 200]
} [@@deriving wiretype]
```

From these five lines come a type the compiler holds every use of, a check on every request that reports every problem at once,

```
quantity: This must be at most 99. (too_large)
note: This must be text, not a number. (unexpected_type)
```

the API's OpenAPI document, and the same type in the front end, through a client printed from the server's routes on every build.

So the server and the front end cannot disagree about what a line is. A change on the server that the front end has not caught up with is a compile error, found by whoever made the change, seconds after making it, with its file and line. In a stack that finds out at run time the same change ships, a user meets it as a broken page, and someone works back from there to the cause. SQL gets the same treatment, since rowtype checks every statement against the migrated database before anything ships.

The same holds above the code. We are building an ontology of what a backend is made of — each concept, what it means, which component provides it, which checks hold it — and it is written in OCaml too.

Milner did not trust the person at the computer at night, himself included, and he did not ask them to be more careful. He built a language in which the careless thing could not be written. An agent will stay up all night writing code, and it should, in a language that says no.

[^gordon]: Michael J. C. Gordon, [From LCF to HOL: a short history](https://www.cl.cam.ac.uk/archive/mjcg/papers/HolHistory.pdf), in *Proof, Language, and Interaction*, MIT Press, 2000. And David MacQueen, Robert Harper and John Reppy, [The History of Standard ML](https://doi.org/10.1145/3386336), HOPL IV, 2020.

[^types1978]: Robin Milner, [A Theory of Type Polymorphism in Programming](https://homepages.inf.ed.ac.uk/wadler/papers/papers-we-love/milner-type-polymorphism.pdf), *Journal of Computer and System Sciences* 17, 1978. Roger Hindley had found the principal type independently, for combinatory logic, in 1969.

[^turing]: The ACM Turing Award citation, 1991, as given in [Robin Milner 1934–2010](https://www.cl.cam.ac.uk/misc/obituaries/milner/0-Prologue.pdf), POPL 2011.

[^history]: [A History of OCaml](https://ocaml.org/history), ocaml.org.

[^astree]: [The Astrée Static Analyzer](https://www.astree.ens.fr/), École normale supérieure.

[^jane-early]: [Jane Street Capital](https://homepages.inf.ed.ac.uk/wadler/realworld/janest.html), in Philip Wadler's list of functional programming in the real world.

[^facebook]: [Hack: a new programming language for HHVM](https://engineering.fb.com/2014/03/20/developer-tools/hack-a-new-programming-language-for-hhvm/), March 2014, [Flow, a new static type checker for JavaScript](https://engineering.fb.com/2014/11/18/web/flow-a-new-static-type-checker-for-javascript/), November 2014, and [Open-sourcing Facebook Infer](https://engineering.fb.com/2015/06/11/developer-tools/open-sourcing-facebook-infer-identify-bugs-before-you-ship/), June 2015, Engineering at Meta.

[^rust]: [Bootstrapping the compiler](https://rustc-dev-guide.rust-lang.org/building/bootstrapping/intro.html), the rustc-dev-guide.

[^wasm]: [The WebAssembly reference interpreter](https://github.com/WebAssembly/spec/blob/main/interpreter/README.md).

[^split]: Rudi Grinberg, [Abandoning Async](http://rgrinberg.com/posts/abandoning-async/), December 2014. The second standard library is Jane Street's [Base](https://github.com/janestreet/base).

[^memory]: Stephen Dolan, KC Sivaramakrishnan and Anil Madhavapeddy, [Bounding Data Races in Space and Time](https://kcsrk.info/papers/pldi18-memory.pdf), PLDI 2018.

[^parallel]: KC Sivaramakrishnan and others, [Retrofitting Parallelism onto OCaml](https://arxiv.org/abs/2004.11663), ICFP 2020.

[^ocaml5]: [OCaml 5.0.0 is out](https://ocaml.org/changelog/2022-12-16-ocaml-50), 16 December 2022.

[^russell]: Thierry Coquand, [Type Theory](https://plato.stanford.edu/entries/type-theory/), the Stanford Encyclopedia of Philosophy.

[^survey]: [Stack Overflow Developer Survey 2025](https://survey.stackoverflow.co/2025/technology), technology.

[^js]: Allen Wirfs-Brock and Brendan Eich, [JavaScript: The First 20 Years](https://zenodo.org/records/4960086), HOPL IV, 2020.

[^ts-goals]: [TypeScript Design Goals](https://github.com/microsoft/TypeScript/wiki/TypeScript-Design-Goals), goals 7 and 9, and non-goal 3.

[^any]: [Everyday Types](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html), the TypeScript Handbook.

[^guido]: Guido van Rossum, [Foreword for "Programming Python"](https://www.python.org/doc/essays/foreword/), 1996.

[^pep484]: [PEP 484 – Type Hints](https://peps.python.org/pep-0484/), 2014.

[^dune-profiles]: [Dune's build profiles](https://dune.readthedocs.io/en/stable/concepts/profiles.html).

[^exhaustive]: [Exhaustiveness checking](https://www.typescriptlang.org/docs/handbook/2/narrowing.html#exhaustiveness-checking), the TypeScript Handbook, [Unreachable code and exhaustiveness checking](https://typing.python.org/en/latest/guides/unreachable.html), Python's typing documentation, and [Why does Go not have variant types?](https://go.dev/doc/faq#variant_types), the Go FAQ.

[^hoare]: Tony Hoare, [Null References: The Billion Dollar Mistake](https://www.infoq.com/presentations/Null-References-The-Billion-Dollar-Mistake-Tony-Hoare/), QCon London, 2009.

[^go-nil]: [Why is my nil error value not equal to nil?](https://go.dev/doc/faq#nil_error), the Go FAQ.

[^colour]: Bob Nystrom, [What Color is Your Function?](https://journal.stuffwithstuff.com/2015/02/01/what-color-is-your-function/), 2015.

[^keyword-generics]: [Announcing the Keyword Generics Initiative](https://blog.rust-lang.org/inside-rust/2022/07/27/keyword-generics/), Inside Rust, July 2022.

[^plotkin]: Gordon Plotkin and Matija Pretnar, [Handlers of Algebraic Effects](https://homepages.inf.ed.ac.uk/gdp/publications/Effect_Handlers.pdf), ESOP 2009.

[^retrofit]: KC Sivaramakrishnan, Stephen Dolan, Leo White, Tom Kelly, Sadiq Jaffer and Anil Madhavapeddy, [Retrofitting Effect Handlers onto OCaml](https://arxiv.org/abs/2104.00250), PLDI 2021.

[^retrofit-stack]: The same paper: the implementation "remains compatible with program analysis tools that inspect the stack".

[^effect-ts]: [The Effect Type](https://effect.website/docs/getting-started/the-effect-type/), Effect's documentation.

[^modal-effects]: On typed effects, which the compiler would check: Wenhao Tang, Leo White, Stephen Dolan, Daniel Hillerström, Sam Lindley and Anton Lorenzen, [Modal Effect Types](https://arxiv.org/abs/2407.11816), OOPSLA 2025.

[^eio]: [Eio](https://github.com/ocaml-multicore/eio), effects-based direct-style I/&#8288;O for OCaml 5.

[^rust-why]: [Why Rust?](https://www.rust-lang.org/), rust-lang.org: its "rich type system and ownership model guarantee memory-safety and thread-safety", "with no runtime or garbage collector".

[^rust-survey]: [Rust compiler performance survey 2025 results](https://blog.rust-lang.org/2025/09/10/rust-compiler-performance-survey-2025-results/), September 2025.

[^leroy-gc]: Xavier Leroy, [Creator of OCaml: Functional Programming, Formal Verification, Programming Languages](https://www.developing.dev/p/creator-of-ocaml-functional-programming), interviewed by Ryan Peterman, July 2026.

[^leroy-lock]: Xavier Leroy, [Creator of OCaml: Functional Programming, Formal Verification, Programming Languages](https://www.developing.dev/p/creator-of-ocaml-functional-programming), interviewed by Ryan Peterman, July 2026.

[^leroy-rust]: Xavier Leroy, [Creator of OCaml: Functional Programming, Formal Verification, Programming Languages](https://www.developing.dev/p/creator-of-ocaml-functional-programming), interviewed by Ryan Peterman, July 2026.

[^leroy-cost]: Xavier Leroy, [Creator of OCaml: Functional Programming, Formal Verification, Programming Languages](https://www.developing.dev/p/creator-of-ocaml-functional-programming), interviewed by Ryan Peterman, July 2026.

[^leroy-jane]: Xavier Leroy, [Creator of OCaml: Functional Programming, Formal Verification, Programming Languages](https://www.developing.dev/p/creator-of-ocaml-functional-programming), interviewed by Ryan Peterman, July 2026.

[^leroy-llm]: Xavier Leroy, [Creator of OCaml: Functional Programming, Formal Verification, Programming Languages](https://www.developing.dev/p/creator-of-ocaml-functional-programming), interviewed by Ryan Peterman, July 2026.

[^leroy-slop]: Xavier Leroy, [Creator of OCaml: Functional Programming, Formal Verification, Programming Languages](https://www.developing.dev/p/creator-of-ocaml-functional-programming), interviewed by Ryan Peterman, July 2026.

[^rwo]: Yaron Minsky's biography in [Real World OCaml](https://dev.realworldocaml.org/).

[^rwo-book]: Yaron Minsky and Anil Madhavapeddy, [Real World OCaml](https://dev.realworldocaml.org/), second edition, Cambridge University Press, 2022.

[^jane-scale]: [Large Scale Trading System](https://ocaml.org/success-stories/large-scale-trading-system), ocaml.org.

[^reuters]: Anirban Sen, [Jane Street's $40 billion trading haul tops rivals, sources say](https://www.marketscreener.com/news/jane-street-s-40-billion-trading-haul-tops-rivals-sources-say-ce7f59dfdf8ff52d), Reuters, April 2026.

[^ocsf]: [The OCaml Software Foundation](https://ocaml-sf.org/), its sponsors.

[^ocamlpro]: [2020 at OCamlPro](https://www.ocamlpro.com/2021/02/02/2020-at-ocamlpro/), on Flambda, built with Jane Street.

[^bucklescript]: [OCaml compiler brings type safety to JavaScript](https://www.infoworld.com/article/3117246/ocaml-compiler-brings-type-safety-to-javascript.html), InfoWorld, September 2016.

[^ahrefs]: [Petabyte-Scale Web Crawling and Data Processing](https://ocaml.org/success-stories/petabyte-scale-web-crawling-and-data-processing), ocaml.org, and [OCaml Developer](https://ahrefs.com/careers/ocaml-developer), Ahrefs careers.

[^ahrefs-melange]: [Ahrefs is now built with Melange](https://tech.ahrefs.com/ahrefs-is-now-built-with-melange-b14f5ec56df4), Ahrefs tech blog, May 2023.

[^docker]: [MirageOS](https://mirage.io/), and Anil Madhavapeddy, [Improving Docker with Unikernels](https://www.docker.com/blog/docker-unikernels-open-source/), Docker blog, May 2016.

[^owl]: [Owl](https://ocaml.xyz/), a system for scientific and engineering computing in OCaml.

[^jane-ai]: John Crepezzi, [Building AI-Powered Developer Tools at Jane Street](https://ai.engineer/talks/building-ai-powered-developer-tools-at-jane-street), AI Engineer Summit, 2025.

[^jane-world]: [Core](https://github.com/janestreet/core), Jane Street's standard library overlay, [Async](https://github.com/janestreet/async), and [Dune 1.0.0](https://ocaml.org/changelog/2018-07-11-dune-100), which began at Jane Street as Jbuilder.

[^melange]: [Melange's rationale](https://melange.re/v7.0.1/rationale.html), melange.re.
