
from fastapi import APIRouter, Depends
from sqlmodel import Session
from database import get_session
from models import SkillOffer

router = APIRouter()

@router.post("/post")
def post_skill(skill: SkillOffer, session: Session = Depends(get_session)):
    session.add(skill)
    session.commit()
    return {"msg": "Skill posted"}
