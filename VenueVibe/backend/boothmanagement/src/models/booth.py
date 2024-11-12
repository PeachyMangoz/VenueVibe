# models/booth.py
from enum import Enum
from typing import Optional
from pydantic import BaseModel, ConfigDict, Field
from datetime import datetime

class AvailabilityStatus(str, Enum):
    AVAILABLE = "available"
    BOOKED = "booked"
    UNAVAILABLE = "unavailable"

class BoothBase(BaseModel):
    event_id: str
    organizer_id: str
    booth_title: str
    booth_image: Optional[str] = None
    description: Optional[str] = None
    price: float
    size: int  # in square meters
    duration: int  # in hours
    availability_status: AvailabilityStatus = AvailabilityStatus.AVAILABLE
    postal_code: str = Field(..., pattern="^\d{6}$")

    model_config = ConfigDict(from_attributes=True)

class BoothCreate(BoothBase):
    model_config = ConfigDict(from_attributes=True)

class BoothUpdate(BaseModel):
    booth_title: Optional[str] = None
    booth_image: Optional[str] = None
    description: Optional[str] = None
    price: Optional[float] = None
    size: Optional[int] = None
    duration: Optional[int] = None
    availability_status: Optional[AvailabilityStatus] = None
    postal_code: str = Field(..., pattern="^\d{6}$")

    model_config = ConfigDict(from_attributes=True)

class Booth(BoothBase):
    booth_id: str
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)
