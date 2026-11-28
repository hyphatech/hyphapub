1. Linux containers are conceptually the same thing as jails, but the implementation differs strikingly.
2. They are built from namespaces, cgroups and seccomp, primitives added by different people at different times and never designed together.
3. LXC glued them together in 2008, Docker replaced LXC with its own libcontainer in 2014, and the OCI standardised that layer, each adding another abstraction on top.
4. Getting an LXC container online takes a bridge, a DHCP server, NAT rules and a veth pair, which is the Linux approach throughout: composable primitives, flexibility and a noticeable amount of glue.
5. A FreeBSD jail is instead a first-class kernel concept and a single syscall.
6. A root filesystem, an IP alias, a jail.conf stanza and one command give a jail that starts instantly, because there is nothing to boot.
7. A jail on a shared IP sits on the host's network with no network isolation, and VNET gives it a fully virtualised network stack where that is needed.
8. The manual routine is verbose but automatable, so the community has built dozens of jail managers.
9. There are so many partly because FreeBSD ships no official one.
10. Three are worth attention today: Bastille, the community favourite, AppJail, which composes jails from stages, and pot, which integrates with HashiCorp Nomad.
11. All three converged on a Dockerfile-inspired template format, to lower the barrier for people coming from Docker.
12. The Dockerfile format exists because Docker had to invent layering on filesystems that had no native concept of it.
13. On FreeBSD with ZFS, layering has been a filesystem primitive since 2005, in snapshots and clones.
14. So copying the Dockerfile format onto jails imports a solution to a problem FreeBSD does not have.
15. The layering belongs at the filesystem, not in a template DSL that cosplays as Dockerfile.
16. It brings no clear advantage either, since these DSLs still differ from Dockerfile, and that difference is friction for anyone escaping to FreeBSD.
17. Bastille is still genuinely good at what it does, cutting the manual routine to three commands after a bootstrap that runs once.
18. Jails give real OS-level isolation with near-zero overhead, from a primitive simple enough to understand end to end in about twenty minutes.
