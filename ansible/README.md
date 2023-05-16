### Instruction

1. Put `ansible.cfg` and `hosts` in configuration file into ansible configured module search path.
2. Run `>> ansible-playbook mrc.yaml` from local machine (make sure VPN is connected).
3. Once the servers are changed, we need to modify the [server] in `hosts` and cluster_nodes in `host_vars/vars.yaml` to make the configuration consistent.

