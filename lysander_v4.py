import re
import math
import numpy as np
from collections import Counter

def extract_features(text):
    total_chars = len(text) if len(text) > 0 else 1
    tokens = text.split()
    total_words = len(tokens) if len(tokens) > 0 else 1
    
    # 1. Punctuation Signature Ratios (Multiplied to match scale weights)
    ellipsis_count = (text.count('...') / total_chars) * 100
    double_dot = (text.count('..') / total_chars) * 100
    comma_count = (text.count(',') / total_chars) * 100
    
    # 2. Capitalization Intensity Index
    # Measures mid-sentence capital letters (excluding the very first word)
    mid_caps = sum(1 for w in tokens[1:] if w and w[0].isupper()) / total_words
    
    # 3. Average Structural Metric
    avg_word_len = sum(len(w) for w in tokens) / total_words
    
    return np.array([ellipsis_count, double_dot, comma_count, mid_caps, avg_word_len])

# --- Target and Profile Corpora ---
target_sample = "ok you walking trisomy do what thy will, I’ll wait. negative posts here....."

suspect_a = "haha just did did it work?? groom me teddy should be a skit"
suspect_b = "Lol wtf.. glad my car ain't got no satellite shit in it. Wouldn't that be some crazy"
suspect_c = "They are simply protesting their daughters being raped This is Nothing new. He was an anti American snake Nothing to see....."

# --- Feature Vector Extraction ---
v_target = extract_features(target_sample)
v_a = extract_features(suspect_a)
v_b = extract_features(suspect_b)
v_c = extract_features(suspect_c)

# --- Cosine Similarity Matrix Execution ---
def get_match_percentage(v_t, v_s):
    denom = (np.linalg.norm(v_t) * np.linalg.norm(v_s))
    return (np.dot(v_t, v_s) / denom) * 100 if denom else 0.0

print("\n=== LYSANDER V4 MULTI-SUSPECT DISTANCE MATRIX ===")
print(f"Suspect A Structural Alignment: {round(get_match_percentage(v_target, v_a), 2)}%")
print(f"Suspect B Structural Alignment: {round(get_match_percentage(v_target, v_b), 2)}%")
print(f"Suspect C Structural Alignment: {round(get_match_percentage(v_target, v_c), 2)}%\n")
