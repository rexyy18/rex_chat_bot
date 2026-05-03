from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from groq import Groq
import os
from dotenv import load_dotenv
load_dotenv()

client = Groq(
    api_key=os.environ.get("GROQ_API_KEY"),
)

class chatRequest(BaseModel):
  message : str


app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
    allow_credentials=True
)

def get_bot_response(user_message):
  message = user_message.lower()
  chat_completion = client.chat.completions.create(
    messages=[
        {
            "role": "user",
            "content": message,
        }
    ],
    model="llama-3.3-70b-versatile",
    stream=False,
)

  return chat_completion.choices[0].message.content


@app.post('/chat')
async def chat(request: chatRequest):
  reply = get_bot_response(request.message)
  return {"reply": reply}