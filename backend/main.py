from fastapi import FastAPI, Request
from pydantic import BaseModel
import uvicorn
import json

app = FastAPI()

# Sample strategy parser input
class StrategyInput(BaseModel):
    natural_language: str

class GoalInput(BaseModel):
    return_target: float
    max_drawdown: float
    timeframe: str  # e.g., "short", "medium", "long"

@app.post("/api/parse_strategy")
async def parse_strategy(input: StrategyInput):
    # Simulated GPT logic (normally you call OpenAI or FinBERT API)
    if "RSI" in input.natural_language:
        response = {
            "entry": ["RSI < 30", "Price > MA50"],
            "exit": ["RSI > 70"]
        }
    else:
        response = {"entry": ["Price > MA50"], "exit": ["Price < MA50"]}
    return response

@app.post("/api/generate_from_goal")
async def goal_to_strategy(goal: GoalInput):
    # Dummy mapping logic
    if goal.return_target > 10:
        strat_type = "Momentum"
    else:
        strat_type = "Mean Reversion"
    return {
        "strategy_type": strat_type,
        "entry": ["RSI < 30"] if strat_type == "Mean Reversion" else ["MA20 > MA50"],
        "exit": ["RSI > 70"] if strat_type == "Mean Reversion" else ["MA20 < MA50"]
    }

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
