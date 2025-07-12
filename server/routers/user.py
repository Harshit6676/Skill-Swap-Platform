
from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from database import get_session
from models import User
from auth import hash_password, verify_password, create_token, get_current_user

router = APIRouter()

@router.post("/register")
def register(user: User, session: Session = Depends(get_session)):
    existing = session.exec(select(User).where(User.email == user.email)).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    user.password = hash_password(user.password)
    session.add(user)
    session.commit()
    return {"msg": "User registered"}

@router.post("/login")
def login(data: dict, session: Session = Depends(get_session)):
    user = session.exec(select(User).where(User.email == data["email"])).first()
    if not user or not verify_password(data["password"], user.password):
        raise HTTPException(status_code=400, detail="Invalid credentials")
    token = create_token({"sub": str(user.id)})
    return {"access_token": token}

@router.get("/me")
def get_me(user: User = Depends(get_current_user)):
    return user

