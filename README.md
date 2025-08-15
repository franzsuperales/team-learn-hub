## STEPS TO RUN (DOCKERIZED)

1. Create 2 env files (.env & .env.local).
2. Populate both env with given sample.env & sample.local.env
3. Run `docker-compose build`.
4. Run `docker-compose up -d`.
5. Open http://localhost:3000 .
6. You'll see landing page.
7. Run `docker-compose exec app npx prisma migrate deploy`.
8. Run `docker-compose exec app npx prisma db seed`
9. Explore

## STEPS TO RUN LOCAL

1. Create db in pgamin
2. Populate both env with given sample.env & sample.env.local
3. Populate both env.
4. RUN `npm run dev`
5. RUN `npx prisma migrate dev`
6. RUN `npx prisma generate`
7. RUN `npx prisma db seed` to inject admin account to db.
8. RUN `npm run dev`
