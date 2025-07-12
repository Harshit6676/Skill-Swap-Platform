from sqlmodel import SQLModel, Field, Relationship
from typing import Optional, List


class Skill(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str
    type: str  # "teach" or "learn"
    description: Optional[str] = None
    user_id: int = Field(foreign_key="user.id")
    
    owner: Optional["User"] = Relationship(back_populates="skills")


class User(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    username: str
    email: str
    password: str

    skills: List[Skill] = Relationship(back_populates="owner")


# Optional: Only keep if you're using SkillOffer elsewhere
class SkillOffer(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int
    skill: str
    level: str
    type: str