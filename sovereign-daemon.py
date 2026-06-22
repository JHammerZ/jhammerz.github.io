name: HEO Sovereign Broadcast

concurrency:
  group: ${{ github.workflow }}-${{ github.ref }}
  cancel-in-progress: true

on:
  push:
    branches: [ main ]
  workflow_dispatch:

permissions:
  contents: write

jobs:
  broadcast:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v4
      with:
        token: ${{ secrets.GITHUB_TOKEN }}
        persist-credentials: true

    - uses: actions/setup-python@v5
      with:
        python-version: '3.11'

    - name: Install deps
      run: |
        pip cache purge
        pip install --force-reinstall -r requirements.txt
        pip list | grep requests

    - name: Configure Git
      run: |
        git config --global user.name "github-actions[bot]"
        git config --global user.email "41898282+github-actions[bot]@users.noreply.github.com"

    - name: Run Daemon
      env:
        ARCHITECT_ACCESS_KEY: ${{ secrets.ARCHITECT_ACCESS_KEY }}
        FB_PAGE_ID: ${{ secrets.FB_PAGE_ID }}
        X_API_KEY: ${{ secrets.X_API_KEY }}
        X_API_SECRET: ${{ secrets.X_API_SECRET }}
        X_ACCESS_TOKEN: ${{ secrets.X_ACCESS_TOKEN }}
        X_ACCESS_SECRET: ${{ secrets.X_ACCESS_SECRET }}
        POST_CONTENT: ${{ github.event.head_commit.message }}
      run: python sovereign-daemon.py
