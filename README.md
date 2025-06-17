# Celestia Bridge Health Checker (Discord)

The Discord bot to check the health of Celestia Bridge nodes, available in the DTEAM community server.

## About

This bot provides a quick and convenient way to verify that your Celestia Bridge node is online and properly configured. It operates in the DTEAM community Discord server, where validators and users can access useful infrastructure tools.

## Usage

1. Prepare your node for remote access:
   - Mainnet:
     ```bash
     sed -i '/$begin:math:display$RPC$end:math:display$/,/^\[/ s/Address = "localhost"/Address = "0.0.0.0"/' $HOME/.celestia-bridge/config.toml
     sudo systemctl restart celestia-bridge
     ```
   - Testnet:
     ```bash
     sed -i '/\[RPC\]/,/^\[/ s/Address = "localhost"/Address = "0.0.0.0"/' $HOME/.celestia-bridge-mocha-4/config.toml
     sudo systemctl restart celestia-bridge
     ```

2. Retrieve your node data:
   - IP:
     ```bash
     hostname -I
     ```
   - Port:
     ```bash
     awk -F' = ' '/\[RPC\]/ {flag=1; next} flag && /Port/ {gsub(/"/, "", $2); print $2; exit}'
     ```
   - Token:
     ```bash
     celestia bridge auth read
     ```

3. Join the [DTEAM Community Discord Server](https://discord.gg/BCeXe63Mm8).

4. Navigate to the `#🤖・celestia-bridge-checker` channel and run: !checknode <ip> <port> <auth_token>

## Examples

### 1. Example bot command


### 2. Bot response with node status


## Links

- [DTEAM Discord Server](https://discord.gg/BCeXe63Mm8)
- [Celestia Docs](https://docs.celestia.org/)

## Contributing

We welcome all contributions to Celestia Bridge Health Checker (Discord)! If you have ideas for new features, improvements, or bug fixes, feel free to open a pull request. We encourage open collaboration and appreciate your help in making this tool even more robust and user-friendly.

If you prefer to discuss or propose improvements privately, or if you need further assistance, please send us an email at **contact@dteam.tech**. We’re excited to collaborate with the community to continually enhance this service.
