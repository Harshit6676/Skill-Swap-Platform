
from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI
from routers import user, skills, match
from database import create_db_and_tables

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # or ["*"] during dev
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def on_startup():
    create_db_and_tables()

app.include_router(user.router, prefix="/api/users")
app.include_router(skills.router, prefix="/api/skills")
app.include_router(match.router, prefix="/api/match")
app.include_router(skills.router)

