---
title: "Back to FreeBSD: Part 2 — Jails"
date: 2026-03-26T18:34:47.944Z
updated: 2026-03-26T19:18:09.983Z
description: "Before we explore FreeBSD jails, it is worth refreshing our understanding of how Linux solved the same problem with LXC (Linux Containers)."
author: roman
front: false
series: back-to-freebsd
cover: /images/back-to-freebsd-part-2/bdec27ee-4225-4087-832a-d9f5b777bbf3.jpg
---

Before we explore FreeBSD jails, it is worth refreshing our understanding of how Linux solved the same problem with LXC (Linux Containers). Clearly inspired by jails, they are conceptually all about the same thing in essence. But the implementation difference is striking.

Linux containers are not a single kernel feature. They are a combination of several independent primitives added to the kernel over a number of years. In a nutshell:

*   **namespaces** — isolate what a process can see: its own PID space, network interfaces, mount points, hostname, users
    
*   **cgroups** — limit and account for what a process can consume: CPU, I/&#8288;O, memory, network bandwidth
    
*   **seccomp** — restrict which system calls a process is allowed to make
    

None of these were originally designed together as a container system. They were added by different people at different times for different reasons. You would be amazed how many steps it takes to get anywhere working with them directly.

LXC was the first serious attempt to glue them together and make them usable. Released in 2008, it gave you a relatively straightforward way to define and launch a system container using those kernel primitives. Early Docker was quite literally built on top of LXC — until 2014, when Docker replaced it with their own runtime called `libcontainer` and cut the dependency.

Ironically, by introducing `libcontainer`, Docker effectively did to LXC what LXC did to the raw kernel primitives — added another abstraction layer on top. And then the OCI came along and standardised that layer, and now you have runc, containerd, and so on.

## LXC container from scratch

I will use Fedora 40 in my examples because that is what is installed on my old MacBook Pro 2015 right now (yeah, second life).

So let's do it — create the container, wire up networking so it can actually reach the internet, and verify it works.

```bash
# install lxc and the networking helper
sudo dnf install lxc lxc-templates

# lxc-net manages a private bridge (lxcbr0) with dnsmasq for DHCP
# and NAT rules so containers can reach the outside world
sudo systemctl enable --now lxc-net
```

Now tell LXC to use the bridge. Edit `/etc/lxc/default.conf`:

```plaintext
lxc.net.0.type = veth
lxc.net.0.link = lxcbr0
lxc.net.0.flags = up
```

The `lxcbr0` bridge was created by `lxc-net`. It sits on `10.0.3.0/24` by default, runs a dnsmasq instance to hand out DHCP leases, and has iptables masquerade rules so container traffic exits through the host's physical interface.

```bash
# create a Fedora 40 container
sudo lxc-create -n mycontainer -t download -- -d fedora -r 40 -a amd64

# start it
sudo lxc-start -n mycontainer

# get a shell inside
sudo lxc-attach -n mycontainer
```

From inside the container:

```sh
# should have a 10.0.3.x address from DHCP
ip addr show eth0

# reaches the internet through NAT on the host
ping -c 3 1.1.1.1

curl -s https://jail.run | head -5
```

It works! Notice what had to happen to get here: a bridge interface, a DHCP server, iptables NAT rules, a `veth` pair connecting the container to the bridge. This is the shape of the Linux approach throughout: composable primitives, flexibility, and a noticeable amount of glue.

```bash
# when done
sudo lxc-stop -n mycontainer
sudo lxc-destroy -n mycontainer
```

## FreeBSD jail from scratch

A FreeBSD jail is not built from composable primitives. It is a first-class kernel concept and a single syscall that says "run this subtree as an isolated environment".[^1] Let's build one.

A jail needs a root filesystem first of all. The cleanest way to get one is to fetch and extract the FreeBSD base distribution:

```bash
mkdir -p /jails/myjail

fetch https://download.freebsd.org/releases/amd64/15.0-RELEASE/base.txz -o /tmp/base.txz

tar -xf /tmp/base.txz -C /jails/myjail
```

This gives you a minimal but complete FreeBSD userland — libc, basic utilities, everything needed to run processes inside the jail. Copy the host's DNS configuration so the jail can resolve names:

```bash
cp /etc/resolv.conf /jails/myjail/etc/resolv.conf
```

Let's keep it simple — no bridge, no DHCP server, no NAT rules. We just add an IP alias to the host's existing network interface, and the jail gets its own address on the same network the host is already on.

```bash
# add an alias to the host's external interface
ifconfig em0 10.0.0.10 alias

# make it persist across reboots
sysrc ifconfig_em0_alias0="inet 10.0.0.10"
```

Replace `em0` with your actual interface — `vtnet0`, `igb0`, whatever `ifconfig` shows. The jail will use this address, and outbound traffic routes through the host's existing gateway.

This networking setup sits directly on the same network as the host, visible on the LAN like any other machine. There is no network isolation here. If you need the jail on its own private subnet, unreachable from outside without explicit port forwarding, that is what VNET is for — a fully virtualised network stack per jail, with its own bridge and NAT through PF. For now, shared IP is enough to show how jails work.

Jails in FreeBSD are configured in `/etc/jail.conf`. Notice `exec.start`, `exec.stop`, `exec.prestart`, `exec.poststop` — they give you clear lifecycle control and handy automation hooks.

```plaintext
myjail {
    host.hostname = "myjail.local";
    path = "/jails/myjail";
    ip4.addr = 10.0.0.10;
    interface = em0;
    exec.start = "/bin/sh /etc/rc";
    exec.stop = "/bin/sh /etc/rc.shutdown jail";
    mount.devfs;
}
```

One command registers the jail with the kernel and it is ready:

```bash
# start it
jail -c myjail

# list running jails
jls

# get a shell inside
jexec myjail /bin/sh
```

From inside:

```sh
ifconfig             # shows 10.0.0.10
ping -c 3 1.1.1.1    # reaches the internet through the host's gateway
fetch -o - https://jail.run | head -5
```

The host is invisible — the jail sees only what you gave it. And it started instantly, because there is nothing to boot.

```bash
# de-register the jail
jail -r myjail

# remove it entirely
rm -rf /jails/myjail
```

## Jail managers

The manual process above is not complicated and pretty straightforward, but it is verbose. Fetching a base system, extracting it, managing IP aliases, writing `jail.conf` stanzas — you see the repeatable routine, and it is all automatable. So the community has built several tools to do exactly that. [Dozens](https://github.com/cbsd/cbsd?tab=readme-ov-file#the-freebsd-ecosystem-today) of them, actually.

The reason there are multiple tools rather than one is partly history,[^2] partly differing opinions about what "managing a jail" should mean, and partly the fact that FreeBSD doesn't ship an official one. The base OS gives you `jail(8)` and leaves the rest to you.

Here are three worth your attention today.

### Bastille

The current community favourite. [Bastille](https://bastillebsd.org/) handles the full lifecycle — bootstrapping release archives, creating jails, managing PF rules, templating — with sensible defaults for the most common case. Can work without ZFS, though it benefits from it. Clean CLI, active development, good documentation.

Templates live in a **Bastillefile**: a list of instructions describing what gets installed and configured inside a jail.

### AppJail

[AppJail](https://appjail.readthedocs.io/en/latest/) introduces a compositional model — jails are assembled from stages and instructions defined in a **Makejail**. It has thought carefully about how jails should be reused and composed into larger systems, and handles complex multi-jail setups well.

### Pot

Where Bastille and AppJail are primarily FreeBSD-native tools, [pot](https://pot.pizzamig.dev/) has first-class integration with [HashiCorp Nomad](https://developer.hashicorp.com/nomad) to mimic modern Kubernetes-style orchestration with pods in mind. If your infrastructure uses Nomad for scheduling, pot fits naturally. Templates live in a **Potfile**.

* * *

All three have independently converged on a Dockerfile-inspired template format. Bastillefile, Makejail, Potfile — different names, same shape, same goals. A sequence of imperative instructions in a small specialised DSL: install this package, copy this file, run this command.

In the case of Bastille, for example:

```plaintext
CP usr /
PKG ca_root_nss unbound
SYSRC unbound_enable=YES
CMD chown unbound:wheel /usr/local/etc/unbound
CMD /usr/local/sbin/unbound-control-setup
CMD /usr/local/sbin/unbound-checkconf && echo "nameserver 127.0.0.1" > /etc/resolv.conf
SERVICE unbound restart
CMD host bastillebsd.org
```

The intent is obvious: lower the barrier for people coming from Docker. Familiar syntax, familiar mental model. A reasonable goal. Does it make any sense?

One of the core reasons Dockerfile format exists in the form it does is that Docker had to solve the layering problem on top of filesystems that had no native concept of it. So Docker invented its own layer model, and the Dockerfile format maps directly onto it — each instruction is potentially a new layer.

FreeBSD with ZFS does not have this problem. Layering is a first-class filesystem primitive on ZFS. Snapshots and clones have been there since 2005. You do not need a container runtime to reinvent layering on top of ZFS — it is already there, at the right level of abstraction, with better semantics.

Copying the Dockerfile format onto jails means importing a solution to a problem you do not have, while ignoring the tools that actually solve it better. The layering belongs at the filesystem. Not in a template DSL that cosplays as Dockerfile.

So all modern jail managers are trying to reinvent something just to make the look and feel similar to what is common in Linux — with no clear advantage, since the offered DSLs are still not the same as the Dockerfile format, and that difference is still friction for anyone escaping to FreeBSD.

We will get into this properly in the next parts. For now, let's use Bastille for what it is genuinely good at.

* * *

## Lab with Bastille

Bastille reduces the manual process from earlier to a handful of commands.[^3]

```bash
pkg install bastille       # install bastille itself
sysrc bastille_enable=YES  # enable it as a service
```

Bastille ships with a `bastille setup` command that handles the initial host configuration in one shot:

```bash
bastille setup
```

After setup, start PF manually:

```bash
service pf start
```

Bastille manages release archives centrally — download once, use for as many jails as you need. Think of it as your base layer for everything built on top:

```bash
bastille bootstrap 15.0-RELEASE
```

Now you have everything to create jails:

```bash
# pick any free IP within the default 10.17.89.0/24 range
bastille create myjail 15.0-RELEASE 10.17.89.10
bastille start myjail
```

Behind the scenes, Bastille handled the directory structure, the `jail.conf` entry, the IP alias, and the PF table registration. Your jail is up and running on `10.17.89.10`.

```bash
# jump into the jail
bastille console myjail
```

From inside:

```sh
ifconfig
fetch -o - https://jail.run | head -5
```

Isolated, reachable, with internet access through NAT on the host. Exactly what we wired up manually, in just three commands.

* * *

Jails give you real OS-level isolation with near-zero overhead. The kernel primitive is simple — a directory, a configuration file, a handful of hooks. The manual process takes about twenty minutes to understand end to end. A manager like Bastille reduces that to three commands and a bootstrap step that only runs once.

[^1]: [Introduction to FreeBSD Jails](https://freebsdfoundation.org/freebsd-project/resources/introduction-to-freebsd-jails/), and [FreeBSD Fridays: Introduction to Jails](https://youtu.be/hQmOc0egcl4?si=qhjCV4BSlp9AFYgX).

[^2]: [20 Years of FreeBSD Jails (2019)](https://youtu.be/S3u8OtjfGFE?si=2BWadr3dwrEZNmzG)

[^3]: [Build Secure FreeBSD Containers in 5 Minutes](https://youtu.be/vVpd34bWCJA?si=B6ADiE8_yV_eFAp9)
