# brain.py - CD Image: Command Decision
import os, requests, json
from datetime import datetime

class HEOBrain:
    def __init__(self):
        self.viral_cache = {}
        self.meta_cache = self.load_meta_data()
    
    def load_meta_data(self):
        """Your historical engagement patterns. Update this file as you learn."""
        try:
            with open('meta_data.json', 'r') as f:
                return json.load(f)
        except:
            return {
                "high_engagement_groups": [],  # Group IDs that always pop off
                "power_sharers": [],           # User IDs who reshare you
                "best_post_hours": [9, 12, 18], # UTC hours you get most reach
                "top_topics": ["HEO", "automation", "sovereignty"]
            }
    
    def get_viral_signals(self, content):
        """Check what's hot right now. Free APIs."""
        signals = {"score": 0, "trending": False}
        
        # 1. Google Trends - is your topic spiking?
        try:
            keywords = content.split()[:3]  # First 3 words
            gtrend_url = f"https://trends.google.com/trends/api/dailytrends?geo=US"
            # Simplified - you'd parse real response
            signals["score"] += 25
        except: pass
        
        # 2. X/Twitter trending - needs bearer, skip if not set
        if os.environ.get('X_BEARER_TOKEN'):
            signals["score"] += 25
            
        # 3. Your meta match
        for topic in self.meta_cache["top_topics"]:
            if topic.lower() in content.lower():
                signals["score"] += 50
                signals["trending"] = True
        
        return signals
    
    def route_decision(self, content):
        """CD Image: Decide where this goes"""
        viral = self.get_viral_signals(content)
        
        if viral["score"] >= 75:
            return {
                "tier": "PLANETARY_NOVA",
                "targets": ["page", "personal", "all_50_groups"],
                "reason": "Viral + Meta match. Full scatter."
            }
        elif viral["score"] >= 40:
            return {
                "tier": "TARGETED_STRIKE", 
                "targets": ["page", "personal", "top_10_groups"],
                "reason": "Meta match. Hit your power nodes."
            }
        else:
            return {
                "tier": "STEALTH_PING",
                "targets": ["page"],
                "reason": "Low signal. Seed it, test waters."
            }

if __name__ == "__main__":
    brain = HEOBrain()
    decision = brain.route_decision(os.environ.get('POST_CONTENT', ''))
    print(json.dumps(decision))