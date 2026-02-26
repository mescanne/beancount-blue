# Tech Stack: beancount-blue

# Core Technologies
- **Language:** [Python](https://www.python.org/) (>= 3.12)
- **Accounting Framework:** [Beancount](https://beancount.github.io/docs/)
- **Importer Framework:** [beangulp](https://github.com/beancount/beangulp)

# Libraries & Tools
- **Dependency Management:** [uv](https://github.com/astral-sh/uv)
- **Data Validation & Settings:** [Pydantic](https://docs.pydantic.dev/), [pydantic-settings](https://docs.pydantic.dev/latest/usage/pydantic_settings/)
- **HTTP Client:** [httpx](https://www.python-httpx.org/)
- **Authentication:** [authlib](https://authlib.org/)
- **API Client (Monzo):** [pymonzo](https://github.com/mescanne/pymonzo)
- **Configuration Parsing:** [PyYAML](https://pyyaml.org/)
- **Date Utilities:** [python-dateutil](https://dateutil.readthedocs.io/)

# Quality Assurance
- **Testing:** [pytest](https://docs.pytest.org/), [pytest-cov](https://pytest-cov.readthedocs.io/)
- **Linting & Formatting:** [ruff](https://github.com/astral-sh/ruff)
- **Static Analysis (Type Checking):** [basedpyright](https://github.com/DetachHead/basedpyright)
- **Dependency Audit:** [deptry](https://github.com/fpgmaas/deptry)
- **Git Hooks:** [pre-commit](https://pre-commit.com/)

# Documentation & Release
- **Documentation Generator:** [mkdocs](https://www.mkdocs.org/) with [material](https://squidfunk.github.io/mkdocs-material/) and [mkdocstrings](https://mkdocstrings.github.io/)
- **Changelog Generator:** [git-cliff](https://git-cliff.org/)
- **Version Management:** [setuptools-scm](https://github.com/pypa/setuptools-scm)
- **Task Runner:** [just](https://github.com/casey/just)
- **CI/CD:** [GitHub Actions](https://github.com/features/actions)
