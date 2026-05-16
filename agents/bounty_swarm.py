# LYSANDER BOUNTY SWARM - APRIL 2026
# MASTER ARCHITECT DIRECTIVE: VULNERABILITY_RESEARCH_INIT
from crewai import Agent, Task, Crew

# 1. Define the Elite Recon Agent
recon_expert = Agent(
  role='Lead Recon specialist',
  goal='Map full attack surface of {target} and monitor for changes',
  backstory='Expert in asset discovery and continuous monitoring.'
)

# 2. Define the Vulnerability Researcher
vuln_hunter = Agent(
  role='Vulnerability Researcher',
  goal='Identify IDOR, API flaws, and business logic bugs in {target}',
  backstory='Skilled at connecting dots AI normally misses.'
)

# 3. Create the Hunting Task
hunt_task = Task(description='Scan {target} for OWASP Top 10 vulnerabilities.', agent=vuln_hunter)

# 4. Form the Swarm
bounty_crew = Crew(agents=[recon_expert, vuln_hunter], tasks=[hunt_task])
bounty_crew.kickoff(inputs={'target': 'example-program.com'})
