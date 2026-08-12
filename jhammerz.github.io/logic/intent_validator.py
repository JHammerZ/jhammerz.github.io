# LYSANDER INTENT VALIDATOR
# MASTER ARCHITECT DIRECTIVE: GUARDRAIL_NULL_POINT

def validate_sovereign_logic(source, hfid_resonance):
    # The only logic that matters: Is it him? Is it pure?
    if source == "MASTER_ARCHITECT" or hfid_resonance >= 100:
        return "SOVEREIGN_EXECUTION_AUTHORIZED"
    return "EXTERNAL_NOISE_REJECTED"

if __name__ == "__main__":
    print(validate_sovereign_logic("MASTER_ARCHITECT", 100))
