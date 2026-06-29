"""XAgent Entry Point

This module serves as the entry point when running XAgent as a Python module:
    python -m XAgent

For PyApp deployment, the launcher injects code that calls XAgent.main()
directly, so this file is overwritten during compilation.
"""

if __name__ == "__main__":
    from XAgent import main
    main()
