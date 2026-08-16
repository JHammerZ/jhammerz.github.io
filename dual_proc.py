print("DUAL PROC ONLINE. Format: data|instruction")
while True:
    try:
        line = input("root> ")
        if '|' in line:
            data, cmd = line.split('|', 1)
            print(f"[DATA]: {data}")
            print(f"[EXEC]: {cmd} -> simulated")
        else:
            print(f"[DATA]: {line}")
    except: break
