Let's be honest: when most of us hear "containers," we think Linux. 🐧 But what if the original idea came from somewhere else entirely?

Before we delve into FreeBSD jails, it's worth taking a moment to refresh our understanding of how Linux solved the very same problem with LXC (Linux Containers). LXC was clearly inspired by jails—conceptually, they're the same thing. But here's the thing: the implementation difference is nothing short of striking. 👀

## 🧩 Linux Containers: A Patchwork, Not a Feature

Linux containers aren't a single kernel feature. They're a combination of several independent primitives, added to the kernel over a number of years. In a nutshell:

- 🔍 **Namespaces:** isolate what a process can *see*—its own PID space, network interfaces, mount points, hostname, and users
- 📊 **Cgroups:** limit and account for what a process can *consume*—CPU, I/&#8288;O, memory, and network bandwidth
- 🛡️ **Seccomp:** restrict which system calls a process is allowed to make

Here's what's fascinating: none of these were originally designed together as a container system. They were added by different people, at different times, for different reasons. Different authors. Different eras. Different goals.

And if you've ever tried working with them directly? You'd be amazed how many steps it takes to get anywhere. 😅

## 📜 A Brief History of Abstraction

LXC was the first serious attempt to glue these primitives together and make them truly usable. Released in 2008, it gave you a relatively straightforward way to define and launch a system container leveraging those kernel primitives.

Early Docker was quite literally built on top of LXC—until 2014, when Docker replaced it with their own runtime called `libcontainer` and cut the dependency.

Now here's the plot twist. 🔄 Ironically, by introducing `libcontainer`, Docker effectively did to LXC exactly what LXC did to the raw kernel primitives—it added *another* abstraction layer on top. Then the OCI came along and standardized that layer, and now you have runc, containerd, and so on.

Layers on layers on layers. That's the Linux landscape in a nutshell.

## 🛠️ Building an LXC Container From Scratch

For these examples, I'll be using Fedora 40, because that's what's installed on my old MacBook Pro 2015 right now (yeah, second life 💻).

So let's dive in—we'll create the container, wire up networking so it can actually reach the internet, and verify that everything works.

```bash
# install lxc and the networking helper
sudo dnf install lxc lxc-templates

# lxc-net manages a private bridge (lxcbr0) with dnsmasq for DHCP
# and NAT rules so containers can reach the outside world
sudo systemctl enable --now lxc-net
```

Next, tell LXC to use the bridge. Edit `/etc/lxc/default.conf`:

```plaintext
lxc.net.0.type = veth
lxc.net.0.link = lxcbr0
lxc.net.0.flags = up
```

💡 **Quick note:** the `lxcbr0` bridge was created by `lxc-net`. By default, it sits on `10.0.3.0/24`, runs a dnsmasq instance to hand out DHCP leases, and has iptables masquerade rules so container traffic exits through the host's physical interface.

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

It works! 🎉

But take a step back and notice everything that had to happen to get here:

- ✅ A bridge interface
- ✅ A DHCP server
- ✅ iptables NAT rules
- ✅ A `veth` pair connecting the container to the bridge

This is the shape of the Linux approach throughout: composable primitives. Flexibility. And a noticeable amount of glue.

```bash
# when done
sudo lxc-stop -n mycontainer
sudo lxc-destroy -n mycontainer
```

## 😈 Building a FreeBSD Jail From Scratch

Now, let's see how FreeBSD does it.

A FreeBSD jail isn't built from composable primitives. It's a first-class kernel concept—a single syscall that says "run this subtree as an isolated environment." (Want to go deeper? Check out [Introduction to FreeBSD Jails](https://freebsdfoundation.org/freebsd-project/resources/introduction-to-freebsd-jails/), and [FreeBSD Fridays: Introduction to Jails](https://youtu.be/hQmOc0egcl4?si=qhjCV4BSlp9AFYgX).)

Let's build one. 🚀

### Step 1: The Root Filesystem

First and foremost, a jail needs a root filesystem. The cleanest way to get one is to fetch and extract the FreeBSD base distribution:

```bash
mkdir -p /jails/myjail

fetch https://download.freebsd.org/releases/amd64/15.0-RELEASE/base.txz -o /tmp/base.txz

tar -xf /tmp/base.txz -C /jails/myjail
```

This gives you a minimal but complete FreeBSD userland—libc, basic utilities, and everything needed to run processes inside the jail. Next, copy the host's DNS configuration so the jail can resolve names:

```bash
cp /etc/resolv.conf /jails/myjail/etc/resolv.conf
```

### Step 2: Networking, Simplified

Let's keep it simple. No bridge. No DHCP server. No NAT rules. ✨

We just add an IP alias to the host's existing network interface, and the jail gets its own address on the same network the host is already on.

```bash
# add an alias to the host's external interface
ifconfig em0 10.0.0.10 alias

# make it persist across reboots
sysrc ifconfig_em0_alias0="inet 10.0.0.10"
```

💡 **Pro tip:** replace `em0` with your actual interface—`vtnet0`, `igb0`, whatever `ifconfig` shows. The jail will use this address, and outbound traffic routes through the host's existing gateway.

⚠️ **Important:** this networking setup sits directly on the same network as the host, visible on the LAN like any other machine. There's no network isolation here. If you need the jail on its own private subnet—unreachable from outside without explicit port forwarding—that's what VNET is for: a fully virtualized network stack per jail, with its own bridge and NAT through PF. For now, though, shared IP is enough to show how jails work.

### Step 3: Configuration

Jails in FreeBSD are configured in `/etc/jail.conf`. Pay close attention to `exec.start`, `exec.stop`, `exec.prestart`, and `exec.poststop`—they give you clear lifecycle control and handy automation hooks. 🪝

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

### Step 4: Launch

One command registers the jail with the kernel, and it's ready to go:

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

The host is invisible—the jail sees only what you gave it. And it started *instantly*. Why? Because there's nothing to boot. ⚡

```bash
# de-register the jail
jail -r myjail

# remove it entirely
rm -rf /jails/myjail
```

## 🧰 The World of Jail Managers

The manual process above is pretty straightforward—but it's verbose. Fetching a base system, extracting it, managing IP aliases, writing `jail.conf` stanzas—you can see the repeatable routine, and it's all automatable.

So the community stepped up and built several tools to do exactly that. [Dozens](https://github.com/cbsd/cbsd?tab=readme-ov-file#the-freebsd-ecosystem-today) of them, actually. 🤯

Why so many tools instead of one? It comes down to three factors:

- 📜 **History:** part of the answer is simply how things evolved (for the full story, check out [20 Years of FreeBSD Jails (2019)](https://youtu.be/S3u8OtjfGFE?si=2BWadr3dwrEZNmzG))
- 💬 **Differing opinions:** people disagree about what "managing a jail" should even mean
- 🏛️ **No official tool:** FreeBSD doesn't ship one—the base OS gives you `jail(8)` and leaves the rest to you

Here are three that are worth your attention today. 👇

### 🏰 Bastille

The current community favorite. [Bastille](https://bastillebsd.org/) handles the full lifecycle—bootstrapping release archives, creating jails, managing PF rules, templating—with sensible defaults for the most common case.

- ✅ Can work without ZFS (though it benefits from it)
- ✅ Clean CLI
- ✅ Active development
- ✅ Good documentation

Templates live in a **Bastillefile**: a list of instructions describing what gets installed and configured inside a jail.

### 🧱 AppJail

[AppJail](https://appjail.readthedocs.io/en/latest/) introduces a compositional model—jails are assembled from stages and instructions defined in a **Makejail**. It has thought carefully about how jails should be reused and composed into larger systems, and it handles complex multi-jail setups well.

### 🍲 Pot

Where Bastille and AppJail are primarily FreeBSD-native tools, [pot](https://pot.pizzamig.dev/) takes a different approach. It has first-class integration with [HashiCorp Nomad](https://developer.hashicorp.com/nomad) to mimic modern Kubernetes-style orchestration, with pods in mind. If your infrastructure uses Nomad for scheduling, pot fits naturally. Templates live in a **Potfile**.

## 🐳 The Dockerfile Déjà Vu

Here's where it gets interesting.

All three tools have independently converged on a Dockerfile-inspired template format. Bastillefile. Makejail. Potfile. Different names—same shape, same goals. Each one is a sequence of imperative instructions in a small, specialized DSL: install this package, copy this file, run this command.

Take Bastille, for example:

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

The intent is obvious: lower the barrier for people coming from Docker. Familiar syntax. Familiar mental model. A reasonable goal.

But does it actually make any sense? 🤔

## 💡 The Uncomfortable Truth About Layers

To answer that, we need to understand *why* the Dockerfile exists in the first place.

One of the core reasons the Dockerfile format takes the form it does is that Docker had to solve the layering problem on top of filesystems that had no native concept of it. So Docker invented its own layer model, and the Dockerfile format maps directly onto it—each instruction is potentially a new layer.

FreeBSD with ZFS? It simply doesn't have this problem. 🙅

On ZFS, layering is a first-class filesystem primitive. Snapshots and clones have been there since 2005. You don't need a container runtime to reinvent layering on top of ZFS—it's already there, at the right level of abstraction, with better semantics.

This isn't just a stylistic choice. It's a fundamental mismatch. Copying the Dockerfile format onto jails means importing a solution to a problem you don't have, while ignoring the tools that actually solve it better.

The layering belongs at the filesystem. Not in a template DSL that cosplays as Dockerfile. 🎭

At the end of the day, all modern jail managers are trying to reinvent something just to make the look and feel similar to what's common in Linux—with no clear advantage. Why? Because the DSLs they offer still aren't the same as the Dockerfile format, and that difference is still friction for anyone escaping to FreeBSD.

We'll get into this properly in the next parts. For now, let's leverage Bastille for what it's genuinely good at. 💪

## 🧪 Hands-On Lab: Bastille in Action

Bastille reduces the entire manual process from earlier to a handful of commands. (Want to see it in action? Check out [Build Secure FreeBSD Containers in 5 Minutes](https://youtu.be/vVpd34bWCJA?si=B6ADiE8_yV_eFAp9).)

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

Bastille manages release archives centrally—download once, use for as many jails as you need. Think of it as your base layer for everything built on top. 🏗️

```bash
bastille bootstrap 15.0-RELEASE
```

And now you have everything you need to create jails:

```bash
# pick any free IP within the default 10.17.89.0/24 range
bastille create myjail 15.0-RELEASE 10.17.89.10
bastille start myjail
```

Behind the scenes, Bastille seamlessly handled:

- ✅ The directory structure
- ✅ The `jail.conf` entry
- ✅ The IP alias
- ✅ The PF table registration

Your jail is up and running on `10.17.89.10`. 🎯

```bash
# jump into the jail
bastille console myjail
```

From inside:

```sh
ifconfig
fetch -o - https://jail.run | head -5
```

Isolated. Reachable. Internet access through NAT on the host. Exactly what we wired up manually—in just three commands. 🙌

## 🔑 Key Takeaways

1. **Linux containers are a patchwork.** Namespaces, cgroups and seccomp were never designed together—and it shows in the glue.
2. **Jails are a first-class kernel concept.** A single syscall, and it starts instantly because there's nothing to boot.
3. **Dozens of jail managers exist.** Bastille, AppJail, and pot are the three worth your attention today.
4. **ZFS already solves layering.** Snapshots and clones have been there since 2005—no Dockerfile-style DSL required.
5. **Bastille gets you there fast.** Three commands and a one-time bootstrap.

## In Conclusion

Jails give you real OS-level isolation with near-zero overhead. The kernel primitive is simple: a directory, a configuration file, and a handful of hooks. The manual process takes about twenty minutes to understand end to end. And a manager like Bastille reduces that to three commands and a bootstrap step that only runs once.

A simple primitive. Real isolation. Near-zero overhead. That's the power of jails. 🔥

Have you tried FreeBSD jails yet? Drop your thoughts in the comments 👇

#FreeBSD #DevOps #Containers #Linux #OpenSource
