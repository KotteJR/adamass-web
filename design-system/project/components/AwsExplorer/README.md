# AwsExplorer

The AWS section's interactive panel: pick a service on the left and the account map lights up the parts it touches.

**Props**: `offers` (`[{ id, title, short, body, marketplace, nodes, specs }]`). `nodes` name parts of the map: `org`, `identity`, `security`, `log`, `audit`, `workloads`, `dev`, `staging`, `prod`, `vpc`, `app`, `data`, `bedrock`, `vpn`, `budgets`.

- This replaces charts. It shows where each service sits in a real AWS organisation.
- The three Marketplace listings link out to their AWS pages. Buying works through a private offer, so there are no prices here.
- Keep the map's labels in AWS's own terms (Organization, Identity Center, OU).
