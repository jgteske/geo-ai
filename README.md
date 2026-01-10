# geo-ai

## Getting started

**Run Local Ai using Ollama:**

```bash
docker compose up -d

# first time
docker exec -it ollama ollama run llama3

# docker ps
# docker exec -it ollama /bin/bash
```

```bash
cd /app

touch .env
```

```env
# /.env
OLLAMA_HOST=http://localhost:11434
```

**Run dev environment:**

```bash
pnpm dev
```
