from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from database import get_session
from models import SkillOffer, User, Skill
from auth import get_current_user
from typing import List

router = APIRouter()

@router.post("/post")
def post_skill(skill: SkillOffer, session: Session = Depends(get_session)):
    session.add(skill)
    session.commit()
    return {"msg": "Skill posted"}


router = APIRouter(prefix="/api/skills")

@router.post("/")
def post_skill(skill: Skill, session: Session = Depends(get_session), user: User = Depends(get_current_user)):
    skill.user_id = user.id
    session.add(skill)
    session.commit()
    session.refresh(skill)
    return skill

@router.get("/mine", response_model=List[Skill])
def get_my_skills(
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    skills = session.exec(select(Skill).where(Skill.user_id == current_user.id)).all()
    return skills

@router.get("/matches", response_model=List[Skill])
def get_skill_matches(
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    # Get current user's skills
    my_skills = session.exec(select(Skill).where(Skill.user_id == current_user.id)).all()

    # Gather opposite type matches
    matched_skills = []

    for skill in my_skills:
        opposite_type = "learn" if skill.type == "teach" else "teach"
        matches = session.exec(
            select(Skill)
            .where(Skill.name == skill.name)
            .where(Skill.type == opposite_type)
            .where(Skill.user_id != current_user.id)
        ).all()

        matched_skills.extend(matches)

    return matched_skills
