import re
import math
import numpy as np
from collections import Counter

def clean_and_tokenize(text):
    """Strips punctuation and extracts lowercase words."""
    clean = re.sub(r'[^\w\s]', '', text.lower())
    return clean.split()

def compute_tfidf_vocab_weights(documents):
    """Builds a custom TF-IDF vocabulary matrix across all inputs."""
    # 1. Gather all unique words (ignoring ultra-common filler words)
    stop_words = {'the', 'and', 'of', 'to', 'a', 'in', 'is', 'that', 'it', 'on', 'you', 'for', 'with'}
    all_tokens = []
    for doc in documents:
        all_tokens.extend(clean_and_tokenize(doc))
        
    vocab = list(set([w for w in all_tokens if w not in stop_words]))
    num_docs = len(documents)
    
    # 2. Calculate Inverse Document Frequency (IDF)
    idf = {}
    for word in vocab:
        docs_with_word = sum(1 for doc in documents if word in clean_and_tokenize(doc))
        idf[word] = math.log((1 + num_docs) / (1 + docs_with_word)) + 1

    # 3. Calculate TF-IDF vectors for each document
    vectors = []
    for doc in documents:
        tokens = clean_and_tokenize(doc)
        tf = Counter(tokens)
        total_words = len(tokens) if len(tokens) > 0 else 1
        
        vec = []
        for word in vocab:
            word_tf = tf[word] / total_words
            vec.append(word_tf * idf[word])
        vectors.append(np.array(vec))
        
    return vectors

def extract_structural_features(text):
    """Captures character-level pacing signatures."""
    total_chars = len(text) if len(text) > 0 else 1
    tokens = text.lower().split()
    total_words = len(tokens) if len(tokens) > 0 else 1
    
    double_dot = text.count('..') / total_chars
    comma_count = text.count(',') / total_chars
    avg_word_len = sum(len(w) for w in tokens) / total_words
    
    return np.array([double_dot, comma_count, avg_word_len])

# --- Live Text Arrays ---
target_sample = "ok you walking trisomy do what thy will, I’ll wait. negative posts here....."
suspect_a_pool = "haha just did did it work?? groom me teddy should be a skit"
suspect_b_pool = "Lol wtf.. glad my car ain't got no satellite shit in it. Wouldn't that be some crazy"

# --- Run Matrix Math ---
# Compute vocabulary rarity similarities
docs = [target_sample, suspect_a_pool, suspect_b_pool]
v_target_vocab, v_a_vocab, v_b_vocab = compute_tfidf_vocab_weights(docs)

# Compute structural similarities
v_target_struct = extract_structural_features(target_sample)
v_a_struct = extract_structural_features(suspect_a_pool)
v_b_struct = extract_structural_features(suspect_b_pool)

# Combine both matrices (Weighted: 60% Structure, 40% Vocabulary)
def calculate_combined_match(v_t_v, v_s_v, v_t_s, v_s_s):
    # Vocab Cosine Similarity
    denom_v = (np.linalg.norm(v_t_v) * np.linalg.norm(v_s_v))
    vocab_sim = np.dot(v_t_v, v_s_v) / denom_v if denom_v else 0
    
    # Structural Cosine Similarity
    denom_s = (np.linalg.norm(v_t_s) * np.linalg.norm(v_s_s))
    struct_sim = np.dot(v_t_s, v_s_s) / denom_s if denom_s else 0
    
    return (struct_sim * 0.60) + (vocab_sim * 0.40)

score_a = calculate_combined_match(v_target_vocab, v_a_vocab, v_target_struct, v_a_struct)
score_b = calculate_combined_match(v_target_vocab, v_b_vocab, v_target_struct, v_b_struct)

print("\n=== LYSANDER V2 ADVANCED DIAGNOSTIC ===")
print(f"Suspect A Overall Match Vector: {round(score_a * 100, 2)}%")
print(f"Suspect B Overall Match Vector: {round(score_b * 100, 2)}%\n")
