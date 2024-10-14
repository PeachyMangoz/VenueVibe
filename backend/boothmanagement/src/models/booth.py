# models/booth.py
from enum import Enum
from typing import Optional
from pydantic import BaseModel, ConfigDict
from datetime import datetime

class AvailabilityStatus(str, Enum):
    AVAILABLE = "available"
    BOOKED = "booked"
    UNAVAILABLE = "unavailable"

class BoothBase(BaseModel):
    event_id: str
    organizer_id: str
    booth_title: str
    booth_image: Optional[str] = None  # URL or path to the image
    price: float
    size: int  # in square meters
    duration: int  # in hours
    availability_status: AvailabilityStatus = AvailabilityStatus.AVAILABLE
    
    model_config = ConfigDict(from_attributes=True)

class BoothCreate(BoothBase):
    model_config = ConfigDict(from_attributes=True)

class BoothUpdate(BaseModel):
    booth_title: Optional[str] = None
    booth_image: Optional[str] = None
    price: Optional[float] = None
    size: Optional[int] = None
    duration: Optional[int] = None
    availability_status: Optional[AvailabilityStatus] = None
    
    model_config = ConfigDict(from_attributes=True)

class Booth(BoothBase):
    booth_id: str
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)
