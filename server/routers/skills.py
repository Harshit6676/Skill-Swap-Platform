from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from database import get_session
from models import Skill, User
from auth import get_current_user
from typing import List
from pydantic import BaseModel

router = APIRouter(prefix="/api/skills")


# ✅ Response model that includes username
class SkillWithUser(BaseModel):
    id: int
    name: str
    type: str
    description: str | None = None
    user_id: int
    username: str

    class Config:
        orm_mode = True


@router.post("/")
def post_skill(
    skill: Skill,
    session: Session = Depends(get_session),
    user: User = Depends(get_current_user),
):
    skill.user_id = user.id
    session.add(skill)
    session.commit()
    session.refresh(skill)
    return skill


@router.get("/mine", response_model=List[Skill])
def get_my_skills(
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user),
):
    skills = session.exec(select(Skill).where(Skill.user_id == current_user.id)).all()
    return skills


@router.get("/matches", response_model=List[SkillWithUser])
def get_skill_matches(
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user),
):
    my_skills = session.exec(select(Skill).where(Skill.user_id == current_user.id)).all()

    matched_skills = []

    for skill in my_skills:
        opposite_type = "learn" if skill.type == "teach" else "teach"

        matches = session.exec(
            select(Skill)
            .where(Skill.name == skill.name)
            .where(Skill.type == opposite_type)
            .where(Skill.user_id != current_user.id)
        ).all()

        # For each matched skill, fetch the username
        for match in matches:
            user = session.get(User, match.user_id)
            matched_skills.append(SkillWithUser(
                id=match.id,
                name=match.name,
                type=match.type,
                description=match.description,
                user_id=match.user_id,
                username=user.username if user else "Unknown"
            ))

    return matched_skills