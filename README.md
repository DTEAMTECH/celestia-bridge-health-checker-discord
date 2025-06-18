# Celestia Bridge Health Checker (Discord)

![bridge_health_checker_discord](https://github.com/user-attachments/assets/4c4bf981-2d81-4db8-8dd0-ddf10a5b9f69)

The Discord bot to check the health of Celestia Bridge nodes, available in the DTEAM community server.

---

## About

This service allows Celestia node operators to verify if their bridge node is online, responsive, and properly configured for RPC access. It operates in the DTEAM community Discord server, where validators and users can access useful infrastructure tools.

## Usage

1. Open the RPC port on your node (change the UFW settings, if applicable):
   - Mainnet:
     ```bash
     sudo sed -i '/\[RPC\]/,/^\[/ s/Address = "localhost"/Address = "0.0.0.0"/' $HOME/.celestia-bridge/config.toml
     sudo systemctl restart celestia-bridge
     ```
   - Testnet:
     ```bash
     sudo sed -i '/\[RPC\]/,/^\[/ s/Address = "localhost"/Address = "0.0.0.0"/' $HOME/.celestia-bridge-mocha-4/config.toml
     sudo systemctl restart celestia-bridge
     ```

2. Gather required data:
   - Get your IP:
     ```bash
     hostname -I
     ```
   - Get your port:
     ```bash
     #mainnet
     sudo awk -F' = ' '/\[RPC\]/ {flag=1; next} flag && /Port/ {gsub(/"/, "", $2); print $2; exit}' $HOME/.celestia-bridge/config.toml

     #testnet
     sudo awk -F' = ' '/\[RPC\]/ {flag=1; next} flag && /Port/ {gsub(/"/, "", $2); print $2; exit}' $HOME/.celestia-bridge-mocha-4/config.toml
     ```
   - Get your authentication token:
     ```bash
     #mainnet
     celestia bridge auth read

     #testnet
     celestia bridge auth read --p2p.network mocha-4
     ```

3. Join the [DTEAM Community Discord Server](https://discord.gg/BCeXe63Mm8).

4. Navigate to the `#🤖・celestia-bridge-checker` channel and run: /checknode <ip> <port> <auth_token>

## Examples

### 1. Example bot command
<img width="866" alt="image" src="https://github.com/user-attachments/assets/bd2fa125-4f4b-4d26-aad4-aed0a15e03d2" />

### 2. Bot response with node status
<img width="869" alt="image" src="https://github.com/user-attachments/assets/de42fe3a-00fe-447e-97ca-6b55b4d502dd" />

## Links

- [DTEAM Discord Server](https://discord.gg/BCeXe63Mm8)
- [Celestia Docs](https://docs.celestia.org/)

## Contributing

We welcome all contributions to Celestia Bridge Health Checker (Discord)! If you have ideas for new features, improvements, or bug fixes, feel free to open a pull request. We encourage open collaboration and appreciate your help in making this tool even more robust and user-friendly.

If you prefer to discuss or propose improvements privately, or if you need further assistance, please send us an email at **contact@dteam.tech**. We’re excited to collaborate with the community to continually enhance this service.
