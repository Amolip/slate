# Slate

Personal task dashboard. Sign in, add a short list, mark items done, remove them.

- **Web:** Angular 19
- **API:** NestJS 11, JWT auth, in-memory store
- **Live demo:** [amolip.github.io/slate](https://amolip.github.io/slate/)

The GitHub Pages demo stores tasks in the browser so anyone can try it. Run the NestJS API locally for the full stack.

## Run locally

```bash
cd api && npm install && npm run start:dev
cd web && npm install && npm start
```

Open [http://localhost:4200](http://localhost:4200).

Demo user for the API: `demo@slate.app` / `slate1234`

## API

| Method | Path | Auth |
| --- | --- | --- |
| GET | `/health` | no |
| POST | `/auth/register` | no |
| POST | `/auth/login` | no |
| GET | `/auth/me` | JWT |
| GET | `/tasks` | JWT |
| POST | `/tasks` | JWT |
| PATCH | `/tasks/:id` | JWT |
| DELETE | `/tasks/:id` | JWT |

The API keeps users and tasks in memory, so data resets when the server restarts.
