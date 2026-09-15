import sys, time
print("m-dos zero-lag active. Type. I reply mid-word.")
buffer = ""
for char in iter(lambda: sys.stdin.read(1), ''):
    buffer += char
    if len(buffer) % 3 == 0:  # every 3 chars, respond
        print(f"\n[WETWARE]: I see '{buffer}' - predicting: continue")
    if char == '\n': buffer = ""
