@echo off
echo [LYSANDER 3.0] INITIALIZING SOVEREIGN COMMAND...
echo Created by: Joshua (JHammerZ) Hamilton
:: Auto-install core manifest requirements
pip install streamlit pandas numpy matplotlib >nul 2>&1
:: Direct execution of the master dashboard
streamlit run dashboard.py
pause
