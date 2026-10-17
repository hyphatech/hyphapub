---
title: "Back to FreeBSD: Part 1 — Intro"
date: 2026-02-20T18:33:48.307Z
updated: 2026-03-26T11:21:21.154Z
description: "Containers ran in production on FreeBSD thirteen years before Docker. So why does nobody talk about it?"
author: roman
front: false
series: back-to-freebsd
cover: /images/back-to-freebsd-part-1/a7e33aa1-1702-4eeb-ad86-28846f851640.jpg
---

A few decades ago, the only well-known way to deliver something to a server, to make it accessible over the internet, was moving files via FTP in Total Commander, FileZilla or FAR Manager, manually copying files and folders from the left pane to the right one. The more advanced among us preferred standard UNIX tools like scp or rsync instead, but the process was essentially the same.

Not rocket science (which is the best part), and it worked! The only obvious problem was that inevitable "oops" moment we've all had — something misclicked, accidentally deleted, edited in the wrong place. No big deal when you're a solo dev on a solo project. A real disaster when you're responsible for dozens of client projects.

A very common backend setup involved multiple websites served by the same Apache web server instance, all sharing the same lifecycle. If Apache went down, everyone went down. If a system dependency broke, everything crashed.

It’s worth mentioning that a more subtle problem appeared when traffic spiked. While your superstar website consumed all available resources, every other site on the same server was quietly suffocating.

Sysadmins scrambled to automate routine tasks, sharing shell scripts full of clever tricks and procedural logic. There was no standard way to do anything yet, including versioning for auditing or rolling back when things went wrong. Most of us used conventions like appending an incremented number or a timestamp to the project folder name. In most cases, manual file tossing worked pretty well. Until it didn’t.

There were at least two clear problems that needed solving:

**Deployment.** How do you deliver reliably? How do you avoid common human fat-finger mistakes? How do you implement versioning and rollbacks? And how do you make the solution generic enough to cover all business cases?

**Process isolation.** How do you protect the app from the system and the system from the app? How do you handle situations where one app’s requirements silently break another’s, or when customers need slightly different versions of the same thing? How do you resolve dependencies?

Attempts to solve the deployment problem gave us a whole new universe of tools and approaches, eventually evolving into modern CI/CD pipelines, packaging standards, and version control. The isolation story, however, is far less well known.

In 1979, Bell UNIX introduced `chroot` — a way to give a process an isolated view of the filesystem, restricting it to a subtree so it couldn't touch anything above it. It was a primitive but genuinely useful idea. The limitation was that `chroot` only isolated the filesystem. The process could still interfere with the network, with other processes, with system resources. It was a partial solution, and a determined application could escape it.

The first serious enterprise answer was virtual machines. VMware brought VMs into mainstream use in the late 1990s, giving each application its own fully isolated OS environment. The problem was cost. Every VM carried a complete OS with significant overhead, and startup times measured in minutes. It was inefficient and expensive, though still cheaper than buying more physical servers.

The quiet revolution happened in 2000. Not on Windows Server, and not yet on Linux, but on **FreeBSD**, a UNIX-based operating system that was the default choice for IT professionals long before Linux dominated the space.

FreeBSD is worth a brief aside here, because it differs from Linux in a fundamental way. Linux is a kernel. What most people call "Linux" is actually that kernel combined with a GNU userland, a package ecosystem, and a set of choices that vary from distro to distro — Ubuntu, Fedora, and Arch are all running the same kernel but are meaningfully different systems underneath.

![The Unix family tree from 1970 to 2007. Unix at Bell Labs, from 1971 to 1989, by Ken Thompson and Dennis Ritchie, gives rise to two families. BSD, from 1978 to 1995, by Bill Joy, leads to SunOS and from it Solaris, to NeXTSTEP and through it Mac OS X, and in 1993 to NetBSD and FreeBSD. OpenBSD forks from NetBSD and is first released in 1996. Xenix, from 1980 to 1991, and the System V systems, HP-UX, AIX, IRIX, which ends in 2006, and UnixWare, come from Bell Labs Unix. Minix is a clone of Unix rather than a descendant, and the GNU Project stands outside both families. Linux joins GNU and owes Minix its start.](/images/back-to-freebsd-part-1/unix-family-tree.svg)

**FreeBSD ships as a complete, coherent OS** — kernel, userland, base tools, and libraries all developed together, versioned together, and tested together as a single unit. That coherence matters. It's part of why FreeBSD solutions tend to be cleaner and why the base system behaves consistently across installations.

The solution FreeBSD built on top of that coherent foundation was called **jails**. Announced by Poul-Henning Kamp and Robert Watson and shipped as a native kernel feature in [FreeBSD 4.0 in March 2000](https://docs.freebsd.org/en/books/handbook/jails/), jails took the `chroot` idea and completed it, adding full network isolation, process isolation, and proper security boundaries.[^1]

[![The title and abstract of “Jails: Confining the omnipotent root” by Poul-Henning Kamp and Robert N. M. Watson. It opens the paper as a PDF](/images/back-to-freebsd-part-1/7f6612cd-b1ee-4c65-84b8-ef80b1fd6a9e.webp)](https://papers.freebsd.org/2000/phk-jails.files/sane2000-jail.pdf)

Each jail gets its own filesystem view, its own network stack, its own process space. The host system is invisible to it. And crucially, it shares the host kernel, meaning near-zero overhead and near-instant startup time.

![The FreeBSD stack, from the bottom up: the BSD kernel, then the filesystem and userspace, then jails, native OS-level containers since 2000, then optional jail managers such as cbsd, bastille, pot and appjail, and your application on top.](/images/back-to-freebsd-part-1/freebsd-stack.svg)

**FreeBSD pioneered the practical implementation of what we now call containers. Not conceptually, but in production, years before the rest of the industry caught up.**[^2]

Sun Microsystems followed with Solaris Zones in 2004, adapting the jails concept for their enterprise customers, and gave back ZFS — the most advanced filesystem ever built — open sourced in 2005 and ported to FreeBSD in 2007. ZFS complemented jails with instant snapshots and efficient layering.

The actual timeline of the isolation problem looks like this:

![Three stages of isolation, left to right: shared servers with no isolation, then virtual machines, heavy but isolated, then containers, lightweight and isolated.](/images/back-to-freebsd-part-1/isolation-stages.svg)

FreeBSD reached that third stage in 2000. Linux wouldn't get there until 2008 with LXC. Docker — the tool most developers think of as the origin of containers — didn't appear until 2013. When Docker was being celebrated as revolutionary, FreeBSD jails were already thirteen years old, mature and battle-tested.

So why does nobody talk about it?

Technical superiority doesn't win ecosystem wars. Linux won through a combination of fast decisions, the viral GPL licence, and strong enterprise backing from Red Hat and IBM. Then Google, Facebook, and Amazon happened — hungry for datacenters, developing tools to manage growing infrastructure at scale. They set the direction for the entire industry.

Linux rapidly went from "the free OS for people who can't afford commercial licences" to "the only acceptable OS for servers".

To solve the distribution and isolation problem, Linux engineers built a set of kernel primitives (namespaces, cgroups, seccomp) and then, in a very Linux fashion, built an entire ecosystem of abstractions on top to “simplify” things:

![The Linux container stack, from the bottom up: the Linux kernel, then namespaces, cgroups and seccomp, kernel isolation primitives from 2006 to 2013, then LXC, system containers, in 2008, then OCI and runc, standardised container execution, in 2015, then Docker and Podman, in 2013 and 2018, then Docker Hub, commercial third-party distribution, and your application on top.](/images/back-to-freebsd-part-1/linux-stack.svg)

Somehow we ended up with an overengineered mess of leaky abstractions for cloud-based, vendor-locked infrastructure.

And this complexity has quietly reshaped how the industry thinks about deploying software. Today, if you want to run an application in a larger system, the implicit assumption is that you containerise it with Docker and orchestrate it with Kubernetes. It's not presented as one option among several — it's presented as the obvious default, the thing you'd be naive or reckless to skip.

What Docker actually solved well was the shipping problem: a universal standard for packing an application with all its dependencies, distributing it through a registry, and running it identically on any machine anywhere. That was genuinely useful, and the OCI image format became a real industry standard.

Jails solve the isolation problem beautifully, but they don't have a native answer to shipping. That gap is real, and it's one of the main reasons the ecosystem around jails feels underdeveloped compared to Docker's world.

The community is aware of it. Some tools attempt to close the gap by mimicking what the modern container ecosystem offers, with moderate success. But there are other approaches too, utilising native FreeBSD primitives that have been quietly sitting there for many years.

* * *

In the next parts, you will see how simple and elegant FreeBSD-based infrastructure can look, how jails work from the ground up, how jail managers help reduce the boilerplate, how you can use Ansible to provision and deploy, why ZFS snapshots are a killer feature worth your attention, and how we put it all together to build robust and scalable infrastructure for Hypha.

[^1]: [Jails: Confining the omnipotent root.](https://papers.freebsd.org/2000/phk-jails.files/sane2000-jail.pdf)

[^2]: [Are FreeBSD Jails a Containers?](https://vermaden.wordpress.com/2025/04/08/are-freebsd-jails-containers/) and a [follow-up discussion.](https://lobste.rs/s/f6wcbv/are_freebsd_jails_containers)
