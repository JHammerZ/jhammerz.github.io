import numpy as np

def extract_weights(text):
    tokens = text.lower().split()
    total_chars = len(text) if len(text) > 0 else 1
    
    double_dot = text.count('..') / total_chars
    comma_count = text.count(',') / total_chars
    emoji_approx = len([c for c in text if ord(c) > 127]) / len(tokens) if len(tokens) > 0 else 0
    
    return np.array([double_dot, comma_count, emoji_approx])

target_sample = "ok you walking trisomy do what thy will, I’ll wait. negative posts here....."
suspect_a_pool = "haha just did did it work?? groom me teddy should be a skit"
suspect_b_pool = "Lol wtf.. glad my car ain't got no satellite shit in it. Wouldn't that be some crazy"

v_target = extract_weights(target_sample)
v_a = extract_weights(suspect_a_pool)
v_b = extract_weights(suspect_b_pool)

sim_a = np.dot(v_target, v_a) / (np.linalg.norm(v_target) * np.linalg.norm(v_a)) if np.linalg.norm(v_a) else 0
sim_b = np.dot(v_target, v_b) / (np.linalg.norm(v_target) * np.linalg.norm(v_b)) if np.linalg.norm(v_b) else 0

print(f"\nSuspect A Structural Match Score: {round(sim_a * 100, 2)}%")
print(f"Suspect B Structural Match Score: {round(sim_b * 100, 2)}%\n")
