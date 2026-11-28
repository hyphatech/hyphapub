Picture this: it's late at night. Your AI agent is up at the computer, writing code all night long, and everything *seems* fine.

But here's the question nobody wants to ask—**did it cut a few corners?** 🤔

Spoiler alert: it did. And whether that shortcut quietly ships to production comes down to one thing—the language you gave it.

Let's dive in. 👇

## 🌙 The Night Robin Milner Couldn't Cut Corners

To understand where we are today, we need to go back to the 1970s.

[Robin Milner](https://en.wikipedia.org/wiki/Robin_Milner)—a computer scientist at the University of Edinburgh—was working on [LCF](https://en.wikipedia.org/wiki/Logic_for_Computable_Functions), a program to check mathematical proofs. It would go on to become one of the three achievements his Turing Award named in 1991. (Yes, *that* Turing Award. 🏆)

Asked about it in a [2003 interview](http://users.sussex.ac.uk/~mfb21/interviews/milner/), he described a night at the computer:

> So if you stayed late at night working out a proof with the computer, you wouldn't have to think afterwards "gosh, did I cut a few corners?", because the LCF system just wouldn't have allowed you to do so!

Let that sink in for a second.

Fast forward fifty years. The one up all night at the computer? It's not a human anymore. It's an agent. And it cuts corners. 🤖

## 🧠 How LCF Made Lying Impossible

Here's where it gets fascinating.

In LCF, proofs were driven by small programs Milner called "tactics." And tactics could be:

- 🧩 **Clever**
- 🫠 **Sloppy**
- ❌ **Or just plain wrong**

So how do you trust the result? Milner's answer was brilliant in its simplicity. A theorem was an abstract type, `thm`, whose *only* operations were the rules of inference. As Michael J. C. Gordon put it in [From LCF to HOL: a short history](https://www.cl.cam.ac.uk/archive/mjcg/papers/HolHistory.pdf) (in *Proof, Language, and Interaction*, MIT Press, 2000), "strict typechecking then ensured that the only values that could be created were those that could be obtained from axioms by applying a sequence of inference rules – namely theorems." (David MacQueen, Robert Harper and John Reppy tell the same story in [The History of Standard ML](https://doi.org/10.1145/3386336), HOPL IV, 2020.)

Read that again. 👀

A tactic could fail. It could loop. It could give up entirely. But it could *never* hand you a false theorem—because no such value could be built.

The language Milner designed to write those tactics in? It was called ML—the MetaLanguage. And OCaml is what it grew into. 🌱

## 🚀 From LCF to OCaml: A Journey Decades in the Making

Here's the thing about great ideas—they outgrow their origins.

ML outlived the prover it was made for. In 1978, Milner proved that a program his type checker accepted could not "go wrong"—and the checker needed *no annotations*, because it inferred every type itself. (📚 The paper: [A Theory of Type Polymorphism in Programming](https://homepages.inf.ed.ac.uk/wadler/papers/papers-we-love/milner-type-polymorphism.pdf), *Journal of Computer and System Sciences* 17, 1978. Fun fact: Roger Hindley had found the principal type independently, for combinatory logic, in 1969.)

His Turing Award named ML too, as "the first language to include polymorphic type inference together with a type-safe exception-handling mechanism" (per the ACM Turing Award citation, 1991, as given in [Robin Milner 1934–2010](https://www.cl.cam.ac.uk/misc/obituaries/milner/0-Prologue.pdf), POPL 2011).

## 🇫🇷 The French Connection

At INRIA, Gérard Huet's team took ML in its own direction and released Caml in 1987. From there, the evolution came fast:

- **1990:** Xavier Leroy rewrote it as Caml Light
- **1995:** It got a native compiler and a module system
- **1996:** With Didier Rémy and Jérôme Vouillon's objects, it became Objective Caml—OCaml for short

The result? A language in which one program can be functional, imperative *and* object-oriented at once. (💡 The full story lives in [A History of OCaml](https://ocaml.org/history) on ocaml.org.)

Want to hear it straight from the source? 🎥

[Creator of OCaml: Functional Programming, Formal Verification, Programming Languages | Xavier Leroy](https://www.youtube.com/watch?v=9Cswiqrq6So)

## ✈️ Built for Things That Have to Be Right

This is where OCaml truly shines. People started building with it things that *had* to be right:

- ✈️ **Airbus:** In 2003, Astrée—an analyzer written in OCaml at the École normale supérieure—proved that the primary flight control software of the Airbus A340, 132,000 lines of C, could never stop on a run-time error. Airbus took it on for the A380. ([The Astrée Static Analyzer](https://www.astree.ens.fr/), École normale supérieure.)
- 📈 **Jane Street:** The trading firm that would grow into Wall Street's leading market maker began writing its systems in OCaml in the early 2000s. ([Jane Street Capital](https://homepages.inf.ed.ac.uk/wadler/realworld/janest.html), in Philip Wadler's list of functional programming in the real world.)
- 📱 **Facebook:** It wrote the type checkers for Hack and Flow in OCaml—plus Infer, which checks every change to its mobile apps before it ships. (See [Hack: a new programming language for HHVM](https://engineering.fb.com/2014/03/20/developer-tools/hack-a-new-programming-language-for-hhvm/), March 2014, [Flow, a new static type checker for JavaScript](https://engineering.fb.com/2014/11/18/web/flow-a-new-static-type-checker-for-javascript/), November 2014, and [Open-sourcing Facebook Infer](https://engineering.fb.com/2015/06/11/developer-tools/open-sourcing-facebook-infer-identify-bugs-before-you-ship/), June 2015, all on Engineering at Meta.)

🤯 **Fun fact:** The first Rust compiler was written in OCaml too—until Rust could compile itself in 2011 (per [Bootstrapping the compiler](https://rustc-dev-guide.rust-lang.org/building/bootstrapping/intro.html) in the rustc-dev-guide). And so is the reference interpreter of WebAssembly ([The WebAssembly reference interpreter](https://github.com/WebAssembly/spec/blob/main/interpreter/README.md)).

## 🧱 The Ecosystem Problem

But here's the plot twist: what grew *around* the language took a very different path.

OCaml's community came mostly from universities, research labs and companies where guarantees mattered more than anything else. And each of them built the tools *it* needed. For years, OCaml had:

- 📚 **Two** standard libraries
- 🔧 **Several** build systems
- 🌐 **A few** quite different ways to compile to JavaScript
- 🔀 **Two** concurrency libraries incompatible with each other

The result? As one of their users put it in 2014, "a split OCaml world with almost no interoperability, and duplication of efforts." (That's Rudi Grinberg in [Abandoning Async](http://rgrinberg.com/posts/abandoning-async/), December 2014. 💡 The second standard library, by the way, is Jane Street's [Base](https://github.com/janestreet/base).)

The language was ready long before its ecosystem. And for years, the ecosystem was what people judged it by. 😬

## ⚙️ The Multicore Moonshot

Meanwhile, the language kept moving.

Until version 5, OCaml—like many other languages at the time—was multi-threaded but single-core. Why? Because its runtime, garbage collector included, "was really designed with sequential executions in mind," as Xavier Leroy explains in [Creator of OCaml: Functional Programming, Formal Verification, Programming Languages](https://www.developing.dev/p/creator-of-ocaml-functional-programming), interviewed by Ryan Peterman, July 2026.

Let's be clear: making a runtime truly parallel is *hard* in itself.

- 🗑️ **The garbage collector** has to keep working while many threads change memory at once—and stay fast. The easy way out, a lock around every operation on memory, would make a program "run as slowly as on a single processor" (Leroy again, in the [same interview](https://www.developing.dev/p/creator-of-ocaml-functional-programming)).
- 🧮 **The memory model** has to say what a program may see when two threads touch the same data—every choice trading speed against simplicity. (See Stephen Dolan, KC Sivaramakrishnan and Anil Madhavapeddy, [Bounding Data Races in Space and Time](https://kcsrk.info/papers/pldi18-memory.pdf), PLDI 2018.)

Now imagine doing it to a *mature* language. That's harder still—because the millions of lines already written must keep working, *and* keep their speed. (📄 KC Sivaramakrishnan and others, [Retrofitting Parallelism onto OCaml](https://arxiv.org/abs/2004.11663), ICFP 2020.)

The OCaml team, most of it at OCaml Labs in Cambridge, spent more than eight years on it. 🗓️ And in December 2022, OCaml 5 came out with parallelism across cores *and* algebraic effects. ([OCaml 5.0.0 is out](https://ocaml.org/changelog/2022-12-16-ocaml-50), 16 December 2022.)

A massive achievement. A long road. A language transformed. 🎉

## 🔍 What Is a Type, Really?

All of that rests on the one thing Milner put in first: **the type**. And the word gets used loosely enough that we need to pin it down before anything leans on it.

## 🏛️ Older Than Computers

Here's something most developers don't realize—the idea is older than computers.

Bertrand Russell sketched a theory of types in 1903 and set it out in 1908. The goal? To keep mathematics out of its paradoxes by sorting things into kinds that cannot be mixed. Then in 1940, Alonzo Church gave it the form programming languages later borrowed. (💡 Thierry Coquand covers it in [Type Theory](https://plato.stanford.edu/entries/type-theory/), the Stanford Encyclopedia of Philosophy.)

A type in a program does the same job. It says what kind of thing a value is—and so what can be done with it.

## 🧠 Assumptions, Written Down

Every program makes assumptions about its data:

- 🔢 This value is a number
- 📋 That list is never empty
- 💳 A payment is in one of four states

A type writes such an assumption down where a machine can check it.

A language without types? It still has the assumptions. It just keeps them in the programmer's head—and finds out one was wrong when the program runs, in front of whoever is using it. 😱

That works while the person who made the assumptions is the one changing the code. It stops working when the code is:

- 📦 Large
- 🕰️ Old
- 👤 Or changed by someone who was never told

And that describes most code an agent touches.

## ⚖️ Describe vs. Bind: The Distinction That Changes Everything

Types can do that job in two fundamentally different ways. A type can **describe** a value—or **bind** it.

- 🔒 **A binding type** is one the program cannot break, whatever code anyone writes—the way a binding contract is one you cannot walk away from when it gets inconvenient.
- 📝 **A describing type** is the program's own account of itself. And nothing makes it true.

The two languages most of us write are Python and TypeScript (per the [Stack Overflow Developer Survey 2025](https://survey.stackoverflow.co/2025/technology), technology). In both, the types came *afterwards*—written on top of a language that runs without them.

## 🟨 TypeScript: JavaScript in a Trench Coat

JavaScript was made in 1995 so that anyone could write a few lines straight into a web page. (📖 Allen Wirfs-Brock and Brendan Eich, [JavaScript: The First 20 Years](https://zenodo.org/records/4960086), HOPL IV, 2020.) And for years, those lines mostly made text scroll and snow fall. ❄️

Then it grew into the language of every web application—with nothing to hold one together.

TypeScript is the most successful attempt to fix that. It's JavaScript with types written in. Its compiler checks them—and then strips them out. So what runs is plain JavaScript that knows *nothing* of them.

To work with whatever JavaScript was already there, its [design goals](https://github.com/microsoft/TypeScript/wiki/TypeScript-Design-Goals) (goals 7 and 9, and non-goal 3) promise to "preserve runtime behavior of all JavaScript code" and keep the types "fully erasable"—and they list a sound type system among the *non-goals*. 😳

So every type can be opted out of. And the way out is `any`.

A value of type `any` can be called, assigned and read from as anything—and whatever is read from it is `any` too (see [Everyday Types](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html) in the TypeScript Handbook). So one `any` spreads quietly through every value it touches. 🦠

`JSON.parse` returns one. And this compiles without a word:

```ts
function chargeCard(customerId: string, amount: number) { ... }

const shipping = 5;
const order = JSON.parse(body);        // any
const total = order.total + shipping;  // any too, and the API sent "49.90"
chargeCard(order.customerId, total);   // accepted as a number, charges "49.905"
```

The bottom line? **A TypeScript codebase is as strict as its least careful line.** At worst, it's JavaScript with annotations.

## 🐍 Python: Never About Types

Python was never about types. Period.

Guido van Rossum started it in December 1989 as a hobby project for the Christmas week. (🎄 He tells the story in his [Foreword for "Programming Python"](https://www.python.org/doc/essays/foreword/), 1996.) It grew up as a language for prototypes, scripts and science—long before anyone asked it to hold a large system together.

Types arrived in 2014 as *hints*, with the promise that "Python will remain a dynamically typed language, and the authors have no desire to ever make type hints mandatory, even by convention." ([PEP 484 – Type Hints](https://peps.python.org/pep-0484/), 2014.)

What checking there is lives in separate tools—mypy and pyright—each with its own rules. And only if somebody runs them. 🤷

## 💡 The Core Insight

Here's what it all boils down to:

**A type that describes is advice, and an agent takes advice the way it takes instructions. A type that binds is a check, and a check cannot be ignored.**

## 🛑 What the Compiler Refuses

Now—OCaml.

Let's take a payment. It's pending, paid, refunded or disputed. And each state carries *only* what belongs to it:

```ocaml
type payment =
  | Pending
  | Paid of { amount : int; receipt : string }
  | Refunded of { amount : int; reason : string }
  | Disputed of { amount : int; case_id : string }
```

Notice what's happening here:

- ✅ Only a paid payment has a receipt
- ✅ There's no way to write a refund without its reason

Now imagine this. Disputes came last—and somebody forgot the one function that decides whether a payment can be refunded:

```ocaml
let can_refund = function
  | Paid _ -> true
  | Pending | Refunded _ -> false
```

```
Warning 8 [partial-match]: this pattern-matching is not exhaustive.
  Here is an example of a case that is not matched: Disputed _
```

**Boom.** 💥

The compiler finds the function nobody opened—and names the case it misses.

It reports it as a warning. But Dune, OCaml's build tool, turns the warning into an error in development builds ([Dune's build profiles](https://dune.readthedocs.io/en/stable/concepts/profiles.html)). So *nothing builds* until every such function has been handled.

How do the others stack up?

- 🟨 **TypeScript:** catches it only in a switch whose author remembered to add a workaround for it ([Exhaustiveness checking](https://www.typescriptlang.org/docs/handbook/2/narrowing.html#exhaustiveness-checking), the TypeScript Handbook)
- 🐍 **Python:** only when a separate checker runs in strict mode ([Unreachable code and exhaustiveness checking](https://typing.python.org/en/latest/guides/unreachable.html), Python's typing documentation)
- 🐹 **Go:** has no such types at all ([Why does Go not have variant types?](https://go.dev/doc/faq#variant_types), the Go FAQ)

## 🚫 The Billion-Dollar Mistake, Avoided

There's no null either. And that's a *big* deal.

Tony Hoare added the null reference to ALGOL W in 1965, "simply because it was so easy to implement"—and later called it his billion-dollar mistake. ([Null References: The Billion Dollar Mistake](https://www.infoq.com/presentations/Null-References-The-Billion-Dollar-Mistake-Tony-Hoare/), QCon London, 2009.) 💸

- ☕ **Java** still pays it on every reference.
- 🐹 **Go** pays it *twice*—since an interface holding a nil pointer is not itself nil. Its FAQ even has a whole entry on why "my nil error value" is not equal to nil ([Why is my nil error value not equal to nil?](https://go.dev/doc/faq#nil_error), the Go FAQ).

In OCaml, a `user` is always a user. A user who might not be there is a `user option`—which the compiler makes you open before you touch it. Simple. Safe. Done. ✨

## ⚡ Effects: The Feature You Didn't Know You Needed

Let's talk about waiting.

A program spends much of its life waiting—for a database, the network, a disk. ⏳

There are two ways to handle it:

1. **Block:** stop the thread until the answer comes. Most web frameworks did just that for years—one thread per request—which holds up until there are more requests than threads a machine can afford.
2. **An event loop:** one thread that never waits and juggles thousands of requests, starting each piece of I/&#8288;O and coming back to it when it's done.

## 🎨 The Function Color Problem

`async` and `await` are how TypeScript, Python and Rust let ordinary-looking code run on that loop. They tell the compiler where a function may pause and hand the thread back to the loop—and they do *nothing else*. So one blocking call inside an `async` function still stalls everything else on it. 😬

And the marks spread.

Bob Nystrom called it in 2015 "the colour of a function," because an `async` function can only be awaited from another `async` one. (📖 [What Color is Your Function?](https://journal.stuffwithstuff.com/2015/02/01/what-color-is-your-function/), 2015—a must-read.)

Here's a greeting built on a lookup that reads from memory:

```ts
function findUser(id: number): User { ... }

function greet(id: number): string {
  return `Hello, ${findUser(id).name}`;
}

function welcome(id: number): string {
  return `<h1>${greet(id)}</h1>`;
}
```

Now the lookup moves to a database and becomes `async`. And `greet` stops compiling—because what comes back is no longer a user:

```
Property 'name' does not exist on type 'Promise<User>'.
```

So `greet` becomes `async`. Then `welcome`. Then whatever calls `welcome`—all the way up: 📈

```ts
async function findUser(id: number): Promise<User> { ... }

async function greet(id: number): Promise<string> {
  return `Hello, ${(await findUser(id)).name}`;
}

async function welcome(id: number): Promise<string> {
  return `<h1>${await greet(id)}</h1>`;
}
```

**One function started waiting. Three changed.** 🤯

Libraries split the same way—one kind for code that waits and one for code that doesn't. In Rust, it runs deep enough that its language team opened an initiative in 2022 to let one function be both. ([Announcing the Keyword Generics Initiative](https://blog.rust-lang.org/inside-rust/2022/07/27/keyword-generics/), Inside Rust, July 2022.)

## 🧪 Enter Algebraic Effects

OCaml 5 has a different answer, straight from programming language research: **algebraic effects**. (🎓 The foundational paper: Gordon Plotkin and Matija Pretnar, [Handlers of Algebraic Effects](https://homepages.inf.ed.ac.uk/gdp/publications/Effect_Handlers.pdf), ESOP 2009.)

Here's how it works:

- 🙋 A function can **perform** an effect—a request it doesn't answer itself.
- 🛎️ A **handler** somewhere up the stack answers it—and resumes the function exactly where it stopped.

Think of it as an exception that can come back with a value:

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

`greet` asks for a name without knowing who answers. Here, the handler answers "Robin." But that's just the start:

- 🧪 **A test** could answer with a fixture
- 🗓️ **A scheduler** could answer "not yet," put `greet` aside, run something else, and come back once the name arrives from a database

Generators, coroutines, lightweight threads and `async` itself can all be built this way—as libraries, with nothing marked in between. (📄 KC Sivaramakrishnan, Stephen Dolan, Leo White, Tom Kelly, Sadiq Jaffer and Anil Madhavapeddy, [Retrofitting Effect Handlers onto OCaml](https://arxiv.org/abs/2104.00250), PLDI 2021.)

## 🎁 More Than the End of Colors

But that one mechanism does more than end the colors:

- 💉 **Dependency injection, almost built into the language:** Code asks, and the handler around it decides. So what other languages need a dependency injection framework for comes close to being a property of the language.
- 🔍 **Real stacks:** A paused function keeps a real stack of its own, so the debuggers and profilers that walk the stack keep working on code that waits. (The same paper: the implementation "remains compatible with program analysis tools that inspect the stack.")

## 🟦 What About Effect for TypeScript?

TypeScript has an ambitious library built on the same idea: Effect. There, a program is a value of type `Effect<Success, Error, Requirements>`—"a description of a workflow or operation that is lazily executed" ([The Effect Type](https://effect.website/docs/getting-started/the-effect-type/), Effect's documentation)—which tracks in its types the errors and dependencies OCaml leaves untyped.

It's a library on top of the language, though. So the code that uses it is written as Effect values, in generators or pipelines—and calling it from plain TypeScript is a boundary of its own. Another color. 🎨

OCaml has effects *in the language itself*. A function that uses one is written like any other function, and the functions that call it don't change.

## 🔄 Eio: Effects in Action

[Eio](https://github.com/ocaml-multicore/eio) is the library that puts effects to work for I/&#8288;O and concurrency in OCaml 5 (effects-based direct-style I/&#8288;O for OCaml 5). It sets a waiting function aside and runs others until its answer arrives. So the lookup can move to a database—and `greet` doesn't change by a single character:

```ocaml
let greet db id = "Hello, " ^ (Users.find db id).name
```

And running two lookups at once? That's a function call—not a new kind of function:

```ocaml
let profile db id =
  let user, orders =
    Eio.Fiber.pair
      (fun () -> Users.find db id)
      (fun () -> Orders.recent db id)
  in
  { user; orders }
```

## 🤖 Why This Matters for Agents

For an agent, it's the difference between **a change** and **a cascade**.

Making one function talk to the network touches *that one function* in OCaml. In a colored language, it touches every caller up to `main`—in files the agent was never asked to open. 📂📂📂

OCaml is one of very few languages with effects built in, and the research behind them is still moving. (🔬 On typed effects, which the compiler would check: Wenhao Tang, Leo White, Stephen Dolan, Daniel Hillerström, Sam Lindley and Anton Lorenzen, [Modal Effect Types](https://arxiv.org/abs/2407.11816), OOPSLA 2025.)

## ⚖️ What the Others Traded

## 🦀 Rust: Brilliant, But at a Price

Rust stands apart—and for good reason. It was made to solve the memory safety problem, and it solves it. ([Why Rust?](https://www.rust-lang.org/), rust-lang.org: its "rich type system and ownership model guarantee memory-safety and thread-safety," "with no runtime or garbage collector.")

But here's the catch. The price is an ownership model the engineer works out and the compiler enforces:

- 👑 Who owns each value
- 🤝 Who may borrow it
- ⏱️ And for how long

Leroy calls it "the finest language that I know for manual memory management"—and that's its trade, since "it's significantly harder to write programs when you have to manage your memory" (in the [Ryan Peterman interview](https://www.developing.dev/p/creator-of-ocaml-functional-programming)).

And it shows in the code. Here's a cache of users in Rust:

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

See the difference? 👀

Every word Rust adds is about memory—and *none* of it is about users. An agent writing Rust spends its effort, and the compiler its refusals, on the machinery rather than on the domain.

## ⏱️ The Feedback Loop Factor

The numbers tell the story. Rust's own survey found that:

- 📊 **55%** of those who answered wait more than ten seconds for an incremental rebuild of their slowest project
- 🚪 Compile times were among the reasons given by **45%** of those who stopped using it

(Source: [Rust compiler performance survey 2025 results](https://blog.rust-lang.org/2025/09/10/rust-compiler-performance-survey-2025-results/), September 2025.)

Why does this matter? An agent works in a loop—a change, then the compiler's feedback—many times over. And the OCaml compiler keeps that loop short. 🔁

What it builds is predictable too. You know *before* it runs what will be fast and what will be slow (as Leroy puts it in the [same interview](https://www.developing.dev/p/creator-of-ocaml-functional-programming)).

## 📊 The Big Picture

![Six languages against six properties of their types. Java checks every case since version 21, has null, is sound, infers only local types, collects garbage and has no async colours since its virtual threads. TypeScript checks every case only with a manual idiom, keeps null out only under a flag, is unsound by design, infers locally, collects garbage and colours functions with async. Python has none of the checks, collects garbage and colours functions with async. Go has no variant types, has nil, is sound, infers only locals, collects garbage and has no colours. Rust checks every case, has no null, is sound, infers inside function bodies, manages memory through ownership instead of a collector, and colours functions with async. OCaml has all six.](/images/the-language-that-says-no/six-languages.svg)

Every one of them traded something away. **OCaml traded the least.**

It reads like what it means. Every module has its contract in an interface file. Every state is named in a type. So nobody *has* to read the code—and anybody *can*. 🙌

## 🏦 Who Bet on It

## 💰 Jane Street: The Biggest Bet

The biggest bet is Jane Street's. And it's a *big* one.

- 🏢 Its people made it "the world's largest industrial user of the language" (per Yaron Minsky's biography in [Real World OCaml](https://dev.realworldocaml.org/))
- 📝 More than **thirty million lines** of OCaml, written by **over five hundred people** ([Large Scale Trading System](https://ocaml.org/success-stories/large-scale-trading-system), ocaml.org)
- 💵 Reuters reported a record **$39.6 billion** of net trading revenue for it in 2025, calling it "Wall Street's leading market maker" (Anirban Sen, [Jane Street's $40 billion trading haul tops rivals, sources say](https://www.marketscreener.com/news/jane-street-s-40-billion-trading-haul-tops-rivals-sources-say-ce7f59dfdf8ff52d), Reuters, April 2026)

What does Jane Street want from OCaml? Speed, reliability—and code that people who are not programmers can read, "like financial engineers or quantitative analysts" (Leroy, in the [Ryan Peterman interview](https://www.developing.dev/p/creator-of-ocaml-functional-programming)).

And it gives back in kind:

- 🥇 Jane Street is a platinum sponsor of [The OCaml Software Foundation](https://ocaml-sf.org/)
- 🛠️ It funds work on the compiler (see [2020 at OCamlPro](https://www.ocamlpro.com/2021/02/02/2020-at-ocamlpro/), on Flambda, built with Jane Street)
- 📖 Yaron Minsky, who brought OCaml there and heads its technology group, co-wrote Real World OCaml—the book on using it in production—which anyone can read online (Yaron Minsky and Anil Madhavapeddy, [Real World OCaml](https://dev.realworldocaml.org/), second edition, Cambridge University Press, 2022)

## 🌍 Beyond Jane Street

Jane Street isn't alone. Not even close:

- 🟦 **Bloomberg** built BuckleScript, a compiler from OCaml to JavaScript, in 2016 ([OCaml compiler brings type safety to JavaScript](https://www.infoworld.com/article/3117246/ocaml-compiler-brings-type-safety-to-javascript.html), InfoWorld, September 2016). **Melange** carried it on inside the OCaml world when BuckleScript became ReScript ([Melange's rationale](https://melange.re/v7.0.1/rationale.html), melange.re).
- 🕷️ **Ahrefs**, the SEO company, crawls the whole web every day with OCaml on more than four thousand servers ([Petabyte-Scale Web Crawling and Data Processing](https://ocaml.org/success-stories/petabyte-scale-web-crawling-and-data-processing), ocaml.org, and [OCaml Developer](https://ahrefs.com/careers/ocaml-developer), Ahrefs careers). And in 2023, it moved all of its front ends to Melange as well ([Ahrefs is now built with Melange](https://tech.ahrefs.com/ahrefs-is-now-built-with-melange-b14f5ec56df4), Ahrefs tech blog, May 2023).
- 🐳 **MirageOS** builds unikernels in OCaml—each an operating system made of only the libraries one application needs. Docker's networking on Mac and Windows came from it ([MirageOS](https://mirage.io/), and Anil Madhavapeddy, [Improving Docker with Unikernels](https://www.docker.com/blog/docker-unikernels-open-source/), Docker blog, May 2016).
- 🦉 **Owl**, begun at the University of Cambridge in 2016, does scientific and engineering computing in OCaml ([Owl](https://ocaml.xyz/), a system for scientific and engineering computing in OCaml).

## 🤖 But What About AI?

Now, let's address the elephant in the room. 🐘

The objection that matters for agents is that models have read far less OCaml than TypeScript or Python. Jane Street trains its own for that reason (John Crepezzi, [Building AI-Powered Developer Tools at Jane Street](https://ai.engineer/talks/building-ai-powered-developer-tools-at-jane-street), AI Engineer Summit, 2025).

But here's the twist. Leroy's latest view is that the OCaml models write is "quite decent and quite similar in quality to more popular languages," and that "one thing that seems to help the generative AI is a type system" (from the [Ryan Peterman interview](https://www.developing.dev/p/creator-of-ocaml-functional-programming)).

Where a model *does* get it wrong, the compiler tells it so on its first try. In a language that describes, the same mistake gets through—and waits for a user to find it. 🐛

Writing code gets cheaper, and checking that it is correct does not (Leroy again, in the [same interview](https://www.developing.dev/p/creator-of-ocaml-functional-programming)).

**A type checker is the cheapest check there is.** 💯

## 💍 One Language to Rule Them All

Here's the uncomfortable truth: OCaml's problem was never a lack of libraries so much as a lack of ones that *fit together*.

A library that made its own choices about errors, JSON or time makes every one around it translate. A coherent ecosystem is what matters. 🧩

That's exactly why Jane Street built its own—with its own standard library, its own concurrency and its own build tool, which became Dune, the one most OCaml projects build with. ([Core](https://github.com/janestreet/core), Jane Street's standard library overlay, [Async](https://github.com/janestreet/async), and [Dune 1.0.0](https://ocaml.org/changelog/2018-07-11-dune-100), which began at Jane Street as Jbuilder.)

## 🆕 The OCaml 5 Challenge

OCaml 5 adds a second problem to the first:

- ⚡ Effects are new
- 📚 So most OCaml libraries were written before them—and don't use them
- 🔄 Eio could only exist once OCaml 5 did

The takeaway? An ecosystem that uses OCaml 5 in full has to be *built* for it.

## 🍄 Enter Hypha Stack

And we build one—[Hypha Stack](https://hyphatech.io/stack), components made to fit together. To name a few:

- 🌐 **[Spindle](https://hyphatech.io/stack/spindle):** serves the API over HTTP
- 📐 **[wiretype](https://hyphatech.io/stack/wiretype):** describes its data once
- 🐘 **[rowtype](https://hyphatech.io/stack/rowtype) and [postgres-eio](https://hyphatech.io/stack/postgres-eio):** put that data in Postgres
- 🧵 **[spool](https://hyphatech.io/stack/spool):** runs the jobs
- 🎨 **[solidtype](https://hyphatech.io/stack/solidtype):** builds the UI

## ✍️ Five Lines. That's It.

Look at how little it takes. Here's a line of an order, as wiretype's own example has it:

```ocaml
type line = {
  sku : string;
  quantity : int; [@min 1] [@max 99]
  note : string option; [@max_length 200]
} [@@deriving wiretype]
```

From these five lines, you get:

- ✅ A type the compiler holds every use of
- ✅ A check on every request that reports every problem at once:

```
quantity: This must be at most 99. (too_large)
note: This must be text, not a number. (unexpected_type)
```

- ✅ The API's OpenAPI document
- ✅ The same type in the front end, through a client printed from the server's routes on every build

## 🔗 No More Drift

So the server and the front end *cannot* disagree about what a line is.

A change on the server that the front end hasn't caught up with is a compile error—found by whoever made the change, seconds after making it, with its file and line. ⚡

In a stack that finds out at run time? The same change ships. A user meets it as a broken page. And someone works back from there to the cause. 😩

SQL gets the same treatment, too—rowtype checks every statement against the migrated database before anything ships.

## 🧭 Beyond the Code

The same holds above the code. We're building an ontology of what a backend is made of—each concept, what it means, which component provides it, which checks hold it. And it's written in OCaml too. 🙌

## 🔑 Key Takeaways

1. **Agents cut corners.** Whether a corner ships depends on the language you gave it.
2. **Describing ≠ binding.** A type that describes is advice. A type that binds is a check—and a check cannot be ignored.
3. **OCaml refuses the careless thing.** Exhaustive matching, no null, and a compiler that names the case you missed.
4. **Effects end the cascade.** One function starts waiting—one function changes.
5. **Every language traded something.** OCaml traded the least.
6. **The ecosystem is the missing piece.** Hypha Stack is built to make the parts fit together.

## In Conclusion

Milner didn't trust the person at the computer at night—himself included. And he didn't ask them to be more careful. He built a language in which the careless thing could not be written.

An agent will stay up all night writing code—and it should. In a language that says no. 🔒

Because at the end of the day, the corner your agent cuts tonight only ships if your language lets it. 🎯

What do you think? Is your stack ready for agents that never sleep? Drop your thoughts in the comments 👇

#OCaml #TypeSafety #AI #AgenticEngineering #SoftwareEngineering #FunctionalProgramming
