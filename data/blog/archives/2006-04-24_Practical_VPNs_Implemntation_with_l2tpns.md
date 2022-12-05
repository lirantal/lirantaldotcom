---
title: Practical VPns with l2tpns
description: >-
  This document was compiled from the administrator's point of view,
  to explain what are VPNs, how they are deployed today and to detail
  the necessary steps and tools to achieve and create a fully working
  VPN solution, integrated with RADIUS systems for AAA.
date: '2006-04-24'
pubDate: '2006-04-24'
categories: []
keywords: []
tags: ['l2tpns', 'radius', 'vpn', 'linux']
image: ~/assets/images/blog/photo-1541185933-ef5d8ed016c.jpg
canonical: https://l2tpns.sourceforge.net/docs/vpn/practical-vpns.html
---

This document was compiled from the administrator's point of view, to explain what are VPNs, how they are deployed today and to detail the necessary steps and tools to achieve and create a fully working VPN solution, integrated with RADIUS systems for AAA.

I will not dwell in this document on how to compile source packages or kernel patching, and with the same tone I'm assuming the reader is an experienced Linux user.

VPNs have their share amount of gossip for being a very complex thing, and in some cases this may be true as they tend to be more security intensive which require adding more and more layers to the scheme. With this said, we'll take a look at how fairly straight-forward it is to setup VPNs and maintain them with various Open-Source tools.

## Table of Contents

## Overview of VPNs and IPsec

### Virtual Private Networks

The purpose of a VPN is to create a secure channel on-top of an un-secure medium, where a computer or a device are put in each end-point in order to establish communication, each of these end-points are often referred to as Point of Presence, or POP. This kind of a communication allows the capability of creating a Virtual Private Network, which is accessible over a medium such as the Internet and thus, extend the physical boundaries of an existing local network.

VPNs have three forms:

Site-To-Site VPNs

these setups exist in order to extend the local network to create a much bigger LAN over the Internet.

Network-To-Host or Remote access VPNs

where a central VPN server is able to achieve multiple connections, often referred to as RoadWarrior VPNs. (This setup is very common among ISPs)

Network-To-Network

extranet VPNs allow secure connections within branches and business partners, they are an extension of a Site-To-Site VPNs.

[Figure 1, “Site to Site VPN”](https://l2tpns.sourceforge.net/docs/vpn/practical-vpns.html#site-to-site "Figure 1. Site to Site VPN")  shows a Site-To-Site VPN diagram.

**Figure 1. Site to Site VPN**

![Site to Site VPN](https://l2tpns.sourceforge.net/docs/vpn/site-to-site-vpn.png)

IP/VPNs are connections which are based upon IP tunnels. A tunnel is a way to encapsulate an IP packet inside another IP packet or some other type of packet. Why do we need tunneling? A Virtual Private Network is identified by IANA's private IP assignments and so such packet can not go beyond the uplink Internet interface.

[Figure 2, “Tunneling Process”](https://l2tpns.sourceforge.net/docs/vpn/practical-vpns.html#tunneling-process "Figure 2. Tunneling Process")  shows the tunneling process.

**Figure 2. Tunneling Process**

![Tunneling Process](https://l2tpns.sourceforge.net/docs/vpn/tunneling-process.png)

Several tunneling protocols are available for manifesting VPNs.

L2F

Layer 2 Forwarding, an older implementation which assume position at the link layer of the OSI. It has no encryption capabilities and hence, deprecated.

L2TP

Layer 2 Tunneling Protocol, still no encryption capabilities.

PPTP

Point-to-Point Tunneling Protocol, and yet again, no encryption.

As seen, the requirement of encryption enhancement is urgent in order to assure authentication, data integrity and privacy. IPsec solves this by providing a suite of security measures implemented at layer 3.

### IP Security Suite (IPsec)

VPN Security is now appearing, this complex things. How so? VPN tunnels by themselves are easily maintained by single-standalone tools like `pppd`, `l2tpns`, `stunnel` and others. Involving security with VPNs though requires more:

- authentication, data integrity and privacy
- keying management

### Note

Keys are secrets being shared by two end-points to provide a secure mean of communication against a third-party connection from sniffing the actual data.

Different ways to handle key management include RADIUS (Remote Authentication Dial In User Service) systems which provide AAA (Authentication, Authorization and Accounting). Another solution is `ISAKMP/Oackly` - Internet Security Association and Key Management Protocol. This solution requires you to posses one of the following:

- something you have
- something you know  
- something you are
    
The more requirements you meet the more secure is the medium, once established. Let's review, something we have is like a certificate, it proves who we are. Something we know, is a key, a secret password which we were told in a whisper, and something we are is our-fingerprint which identifies ourselves from other individuals.

#### IPsec in Depth

IPsec consists of two main protocols, an Authentication Header and Encapsulation Security Payload, also known as AH and ESP. Although it is not bound to these and can be extended (and often is) to other standards such as:
- Data Encryption Standard (DES and 3DES)
- Diffie-Hellman (DH)
- Secure Hash Algorithm-1 (SHA1)
- Message Digest 5 (MD5)
- Internet Key Exchange (IKE)
- Certification Authorities (CA)
    

We'll be deploying an IKE daemon to handle the key management, which uses the Diffie-Hellman cryptography protocol in order to allow two parties to establish a connection based upon a shared secret key that both parties posses. (Authentication within IKE is handled by MD5 hashing)

IKE is responsible for authentication of two IPsec parties, negotiation of keys for encryption algorithms and security associations. This process is commonly regarded as two phases:

Phase 1: IKE Security Association

The IKE daemon authenticates against the peers in order to achieve a secure channel, according to the Diffie-Hellman key agreement.

Phase 2: IKE IPsec Negotiation

After achieving an authenticated channel, the parties now negotiate a secure transform (the way to encrypt and secure the medium) where the sender is offering his/hers transform set after which the receiver decides upon one. An IPsec session can now safely begin.

Just to be clear, a Security Association is an agreed relation between two parties which describes how they will use security services (from IPsec) to communicate.

#### IPsec Modes

IPsec can operate in two different modes:

Transport mode

takes place when two devices (like a station and a gateway (now considered a host)) are establishing a connection which upon they both support IPsec.

Tunnel mode

we require tunnel mode when we proxy IPsec connections between two stations behind the IPsec gateway. For example, in a Site-to-Site VPN a tunnel mode lives, since it exists in order to provide the stations behind these gateways running the VPN/IPsec to communicate securely. In this situation, both end-points are running an IPsec software.

In definition, a tunnel mode IPsec is better secured than transport. Without going too deep into the ins-and-outs of the technical side, transport mode doesn't encapsulate the actual IP layer but only the tcp/udp (Transport layer of the OSI) where-as a tunnel mode encapsulate both the Transport layer and the IP layer into a new IP packet.

To summarize, we need VPNs for data-exchange methods and a set of IPsec tools for security reasons.

## VPN Deployment

I've assembled another diagram to view the actual VPN setup.  [Figure 3, “VPN Deployment”](https://l2tpns.sourceforge.net/docs/vpn/practical-vpns.html#vpn-deployment "Figure 3. VPN Deployment")  gives a general description of how the network will be layed out in real-world scenario.

**Figure 3. VPN Deployment**

![VPN Deployment](https://l2tpns.sourceforge.net/docs/vpn/vpn-deployment.png)


We notice that a single Linux box is acting as a Gateway and has all the services included with it. This is a bad idea from a security perspective but it's easy to just deploy the FreeRADIUS and MySQL servers on another machine. Of course the L2TPns and the rest of the IPsec tools suite would have to remain on the Gateway box (not necessarily the Firewall).

[Figure 4, “VPN Process”](https://l2tpns.sourceforge.net/docs/vpn/practical-vpns.html#vpn-process "Figure 4. VPN Process")  attempts to explain the actual process that the VPN takes and to detail the place that each of that application-in-charge takes place.

**Figure 4. VPN Process**

![VPN Process](https://l2tpns.sourceforge.net/docs/vpn/vpn-process.png)


### Requirements

#### The Toolbox

Following is a description of the requirements you will have to meet:

A Linux box

preferably a 2.4.27 kernel or higher.

Debian is the chosen distribution which means we'll be using apt-get for installation, but I'll also focus on basic source tarballs installation.

Dependencies:
- `ipsec` configuration in the kernel

L2TPns

an L2TP PPP Termination tool.

Dependencies:
- `libcli` 1.8.0 or greater
- `tun/tap` interface compiled in the kernel or as a module
    

FreeRADIUS

For authentication, and accounting.

MySQL

To act as a back-end database for the RADIUS.

OpenSwan

Provides the ipsec suite package.

#### Kernel Support

Debian stock kernel 2.4.27 and up are ipsec compatible although if you think otherwise check for the `kernel-patch-openswan` package.

### Installation

#### L2TPns

##### Installation

> L2TPns is a layer 2 tunneling protocol network server (LNS). It supports up to 65535 concurrent sessions per server/cluster plus ISP features such as rate limiting, walled garden, usage accounting, and more.

In a personal note - L2TPns is highly configurable for many cases, and extremely reliable for production/commercial use.

Step 1:

Make sure you have `libcli-1.8` development package installed:

```
$ apt-cache search libcli
libcli-dev - emulates a cisco style telnet command-line interface (dev files)
libcli1 - emulates a cisco style telnet command-line interface
$ apt-get install libcli-dev
```

Step 2:

Download the source from  [SourceForge](http://sourceforge.net/projects/l2tpns/).

Step 3:

Build and install:  `make && make install`

### Note

Alternately, you can skip these steps and simply  `apt-get install l2tpns`.

### Note

On RPM-based distributions, you should be able to make packages from the `libcli` and `l2tpns` source tarballs with  `rpmbuild -ta`.

Once compilation is done you will have `l2tpns` in  `/usr/sbin/l2tpns`, and all configuration files can be found in  `/etc/l2tpns/`.

##### Configuration

The only configuration that L2TPns takes is centralized in the configuration file  `/etc/l2tpns/startup-config`.

```
set debug 2                               # Debugging level
set log_file "/var/log/l2tpns"            # Log file: comment out to use stderr, use
                                          # "syslog:facility" for syslog
set pid_file "/var/run/l2tpns.pid"        # Write pid to this file
set l2tp_secret _"secret"_                  # shared secret
set primary_dns _212.117.128.6_             # Only 2 DNS server entries are allowed
set secondary_dns _212.117.129.3_
set primary_radius _192.168.0.1_            # Can have multiple radius server entries,
                                          # but ony one radius secret
set primary_radius_port 1812
set radius_secret _"radius_secret"_
set radius_accounting yes
set radius_dae_port 3799
set accounting_dir "/var/run/l2tpns/acct" # Write usage accounting files into specified
					  # directory
set peer_address _192.168.0.1_              # Gateway address given to clients
load plugin "sessionctl"                  # Drop/kill sessions
load plugin "autothrottle"                # Throttle/snoop based on RADIUS
load plugin "throttlectl"                 # Control throttle/snoop with nsctl
load plugin "snoopctl"
```

This is the trimmed down version of probably most of the common configuration and even some extra options.

Important configuration options are highlighted and you should adjust these to meet your network needs. We can deploy all of the environment into one box which is of course not a very good idea from a security point of view, but will function just fine. Moreover, we will be using aliased IP addresses so once you've decided to move the FreeRADIUS daemon to another computer on the LAN it will be fairly easy and won't take too much configuration into it.

Next, we need to setup the IP pool that L2TPns will provide to each VPN client. The configuration file is located at  `/etc/l2tpns/ip_pool`  and should look like the following:

```
172.16.21.0/24
```

### Important

Of course you can change this pool to anything else (IANA IPs assigned for private internets only) just make sure it is not conflicting with your current LAN network addresses. This means that if you've assigned addresses of 192.168.0.1 and 192.168.0.2 to your LAN boxes you can't have a pool of 192.168.0.1/24 defined since L2TPns will try to route those addresses from the tun device, which is needless to say a bad idea...

Next up, creating the access-list for L2TPns.

Add a username and password into  `/etc/l2tpns/users`:

```
admin:12345
```

The password may either be plain-text as above, or encrypted with MD5 or DES (to distinguish DES from plain-text passwords, prefix the value with  `{crypt}`).

L2TPns utilizes a terminal connection on port 23 which you would feel very comfortable in if you have worked with routers and switches devices before. The terminal provides control over the ppp termination which is why we've created an account to log on to.

#### IPsec

##### Installation

User-space IPsec tools for various IPsec implementations exist for linux, among them is the port of KAME's `libipsec`, `setkey`, and racoon. Others are the OpenSWAN (a successor to the FreeSWAN project).

Getting IPsec installed is fairly easy with Debian:

```
$ apt-get install openswan
```

The OpenSWAN project provides packages for RPM-based distributions.

Alternately, you may download the  [source](http://www.openswan.org/code/)  from the OpenSWAN project:

```
$ tar xvzf openswan-2.4.4.tar.gz
$ cd openswan-2.4.4
$ ./configure && make && make install
```

##### Configuration

OpenSWAN acts as the IKE daemon (remember IKE? it's job is to authenticate between the two peers and negotiate a secure medium). We will be setting up the IKE daemon as a RoadWarrior configuration, a term for remote access VPNs.

We desire this approach for compatibility because after our VPN solution will be complete any user from a Windows machine will be easily ready to connect without any 3rd party applications, same for Linux.

Configuration files are placed in  `/etc/ipsec.d/`,  `/etc/ipsec.conf`  and  `/etc/ipsec.secrets`.

Let's start by choosing the remote client and it's PSK (Private Shared Key)  `/etc/ipsec.secrets`:

```
hostname_or_ipaddress %any : PSK "mysecretkeyisverylong"
```

This is an IP/key pair. The IP or FQDN defines the local peer (like a SOHO branch), then the remote host. Here we defined %any for all hosts, though it's possible to define only a specific IP. At last, we define the key associated with it.

A better way to create a key is to utilize /dev/random for creating a unique key.

```
$ dd if=/dev/random count=16 bs=1 2>/dev/null | xxd -ps
```

Next, let's prepare the configuration file  `/etc/ipsec.conf`:

```
version 2.0
config setup
     nat_traversal=yes

conn l2tp
     authby=secret
     pfs=no
     keyingtries=3
     left=real_ip_address
     leftnexthop=%defaultroute
     leftprotoport=17/%any
     right=%any
     rightprotoport=17/%any
     auto=add

include /etc/ipsec.d/examples/no_oe.conf
```

In this file we have first defined version 2 which is a must, then enabled NAT Traversal. To understand the importance of this feature think of the following scenario: A remote user attempts to connect while he's behind a router and therefore NATed. The router has to de-encapsulate the packet, change things and then build it up again and send it. IPsec doesn't like other people messing with it's packet. That's why we solve this issue with NAT Traversal.

Next up we configure authentication type (certificates, psk, rsa keys, etc) then the left and right peers. The default mode OpenSWAN takes is tunnel unless told otherwise. I won't go into in-depth explanation of every method, you can take a quick look at  `/etc/ipsec.d/examples`  for more explanation and other variations of working with RSA keys, Certificates, host-to-host, and more.

In summary:

-   We've configured an almost complete IPsec VPN setup.
    
-   We've installed and configured a VPN server (L2TPns) and our IPsec security suite.
    
-   To control both of them we use:  `/etc/init.d/l2tpns`  and  `/etc/init.d/racoon`  (location of start-up scripts may vary on non-Debian systems, or if you've installed from source).
    

#### FreeRADIUS

The VPN setup needs to authenticate against something, that is the users database which we chose to be a FreeRADIUS server backed with a MySQL database.

##### Installation

> FreeRADIUS is the premiere open source RADIUS server. While detailed statistics are not available, we believe that FreeRADIUS is well within the top 5 RADIUS servers world-wide, in terms of the number of people who use it daily for authentication. It scales from embedded systems with small amounts of memory, to systems with millions of users. It is fast, flexible, configurable, and supports more authentication protocols than many commercial servers.

Installing on Debian:

```
$ apt-get install freeradius freeradius-mysql
```

From source: Download the latest `freeradius` package from  [freeradius.org](http://freeradius.org/getting.html)

```
$ tar xvzf freeradius.tar.gz
$ cd freeradius
$ ./configure && make && make install
```

##### Configuration

This will appear a bit complex but it isn't, it's just a lot of configuration.

Following are the configurations you need to have in your  `/etc/freeradius/`  files.

In this section I will not give you a dump of the configuration since they are very long and mostly default. I'll just post which changes to make.

We haven't yet configured MySQL, but it'll come afterwards, don't worry.

Make the following changes to the file  `/etc/freeradius/sql.conf`:

```
server = "192.168.0.1"
login = "radius"
password = "12345678"
```

Add the following to the file  `/etc/freeradius/clients.conf`:

```
client 192.168.0.1 {
	secret	  = my_secret
	shortname = localhost
	nastype	  = other
}
```

Don't confuse the secret directive there with IPsec. RADIUS server are using secret keys also to identify their allowed NAS (Network Access Servers), these are the clients that talk to the RADIUS server.

Also, change the  `client 127.0.0.1 {}`  directive to hold the secret "my_secret" like we configured for 192.168.0.1 to avoid conflicts.

Uncomment the  `sql`  directive in the  `authorize`,  `accounting`, and  `session`  sections of  `/etc/freeradius/radiusd.conf`.

Now for populating FreeRADIUS with MySQL. If you don't know or haven't set root password for MySQL you can do it now with:

```
$ mysqladmin -u root password password_here
```

Then add the following to  `/root/.my.cnf`:

```
[mysqladmin]
user = root
password = password_here
```

Create the  `radius`  database, using the schema given in  `/usr/share/doc/freeradius/examples/db_mysql.sql.gz` .

### Note

It may be necessary to modify the column definition of  `id`  in the  `nas`  table, removing  `DEFAULT '0'`  such that the definition reads:

```
id int(10) NOT NULL auto_increment
```

As follows:

```
$ mysqladmin create radius
$ mysql radius
mysql> source db_mysql.sql
mysql> GRANT ALL ON * TO 'radius'@'localhost' IDENTIFIED BY 'radius_password';
```

All the configuration is now done. Let's add a user to our VPN database.

```
$ mysql radius
mysql> INSERT INTO radcheck values (0, "test", "User-Password", "==", "1234");
```

We have now created a user in the database of username  `test`  and password  `1234`.

Testing the RADIUS setup is simple using the `radtest` utility provided with it.

```
radtest
Usage: radtest user passwd radius-server[:port] nas-port-number secret [ppphint] [nasname]

radtest test 1234 192.168.0.1 1812 my_secret
```

`radtest` sends an Access-Request to the RADIUS server and expects an `Access-Accept` back from it. If you're not getting an `Access-Accept` from the RADIUS you're advised to check the configuration again and see what you might have missed.

#### Firewall Configuration

We need to apply a few things to iptables configuration and kernel networking.

First off, we need to accept VPN-specific packets through the firewall. Of course you will have to adjust the rules to fits you needs, in this case, ppp0 is the Internet interface.

```
$ iptables --append INPUT --in-interface  ppp0 -p udp --dport 1701 -j ACCEPT
$ iptables --append INPUT --in-interface  ppp0 -p udp --dport 500 -j ACCEPT
$ iptables --append INPUT --in-interface  ppp0 -p udp --dport 4500 -j ACCEPT
$ iptables --append INPUT --in-interface  ppp0 -p 50 -j ACCEPT
```

If you haven't setup your Linux box as a gateway yet then you have to allow forwarding/masqing for the boxes on the LAN (and therefore for the VPN clients):

```
$ iptables --table nat --append POSTROUTING --out-interface ppp0 -j MASQUERADE
$ iptables --append FORWARD --in-interface eth0 -j ACCEPT
$ echo 1 > /proc/sys/net/ipv4/ip_forward
```

## References

VPN Reference

[http://www.jacco2.dds.nl/networking/freeswan-l2tp.html](http://www.jacco2.dds.nl/networking/freeswan-l2tp.html)

L2TPns Project

[http://l2tpns.sourceforge.net](http://l2tpns.sourceforge.net/)

OpenSWAN Project

[http://www.openswan.org](http://www.openswan.org/)

### Liran Tal

<[liran@enginx.com](mailto:liran@enginx.com)>

### Yakov Shtutz

Special thanks

### Shahar Fermon

Testing and feedback
