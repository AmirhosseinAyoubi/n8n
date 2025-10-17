

**Express → n8n → Flask → n8n → Express → React**

## Services
- **express** (port 3000): Serves a tiny React page and exposes `/api/process` that calls the n8n webhook.
- **flask** (port 5000): Simple analysis endpoint `/analyze` that returns `{"status": "Large"|"Low"}`.
- **n8n** (port 5678): Visual workflow tool that connects Express and Flask.

## Run

   ```bash
   docker compose up --build
   ```
3. Open **n8n** 

4. Open the dashboard at **http://localhost:3000**
# n8n
