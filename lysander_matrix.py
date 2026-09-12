import re
import math
import numpy as np
from collections import Counter

class LysanderStylometryEngine:
    def __init__(self):
        # Universal topic-neutral function words to capture subconscious structural habits
        self.function_words = [
            'the', 'and', 'of', 'to', 'a', 'in', 'is', 'that', 'it', 'on', 
            'you', 'he', 'was', 'for', 'at', 'with', 'as', 'his', 'they', 'but'
        ]
        # Core individualistic punctuation patterns
        self.punctuation_targets = [',', '.', '...', '!', '?', ';', ':', '-', '"', "'"]

    def _calculate_shannon_entropy(self, text):
        """Measures the vocabulary complexity and structural randomness of the text."""
        clean_text = re.sub(r'[^\w\s]', '', text.lower())
        words = clean_text.split()
        if not words:
            return 0.0
        counts = Counter(words)
        total = len(words)
        entropy = -sum((count / total) * math.log2(count / total) for count in counts.values())
        return round(entropy, 4)

    def extract_feature_vector(self, text):
        """Converts raw text into a normalized, high-dimensional numerical tensor."""
        tokens = text.lower().split()
        total_words = len(tokens) if len(tokens) > 0 else 1
        total_chars = len(text) if len(text) > 0 else 1

        # 1. Lexical Metrics
        avg_word_length = total_chars / total_words
        unique_words = len(set(tokens))
        ttr = unique_words / total_words

        # 2. Function Word Density Matrix
        func_word_counts = [tokens.count(w) / total_words for w in self.function_words]

        # 3. Punctuation Profile Signature
        punc_counts = [text.count(p) / total_chars for p in self.punctuation_targets]

        # 4. Text Entropy
        entropy_val = self._calculate_shannon_entropy(text)

        # Assemble unified feature vector
        vector = [avg_word_length, ttr, entropy_val] + func_word_counts + punc_counts
        return np.array(vector)

    def compute_similarity(self, baseline_text, suspect_text):
        """Calculates the exact Cosine Similarity and Euclidean Distance between vectors."""
        v1 = self.extract_feature_vector(baseline_text)
        v2 = self.extract_feature_vector(suspect_text)

        # Compute Cosine Similarity (Directional profile match)
        dot_product = np.dot(v1, v2)
        norm_v1 = np.linalg.norm(v1)
        norm_v2 = np.linalg.norm(v2)
        cosine_sim = dot_product / (norm_v1 * norm_v2) if norm_v1 and norm_v2 else 0.0

        # Compute Euclidean Distance (Magnitude variance match)
        euclidean_dist = np.linalg.norm(v1 - v2)

        return {
            "Profile Match Confidence": round(float(cosine_sim) * 100, 2),
            "Structural Variance Distance": round(float(euclidean_dist), 4)
        }

if __name__ == "__main__":
    engine = LysanderStylometryEngine()

    print("\n--- ENTER VERIFIED BASELINE TEXT (Press Ctrl+D when finished) ---")
    baseline_lines = []
    while True:
        try:
            line = input()
            baseline_lines.append(line)
        except EOFError:
            break
    verified_baseline = "\n".join(baseline_lines)

    print("\n--- ENTER INCOMING TARGET TEXT TO COMPARE (Press Ctrl+D when finished) ---")
    suspect_lines = []
    while True:
        try:
            line = input()
            suspect_lines.append(line)
        except EOFError:
            break
    incoming_suspect_text = "\n".join(suspect_lines)

    if verified_baseline.strip() and incoming_suspect_text.strip():
        results = engine.compute_similarity(verified_baseline, incoming_suspect_text)
        print("\n=== LYSANDER DIAGNOSTIC MATRIX ===")
        print(f"Mathematical Profile Match: {results['Profile Match Confidence']}%")
        print(f"Vector Space Distance Score: {results['Structural Variance Distance']}\n")
    else:
        print("\n[!] Error: Inputs cannot be empty.\n")
