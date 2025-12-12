
# SYSTEM CONTEXT

A beancount plugin in Python 3.11+.

# CODING STANDARDS

1. **Type Checker:** I use `basedpyright`. Code must be strictly typed.
   - Do NOT use `Any`. Use `object` or `typing.Protocol` if unsure.
   - Use `cast` only when necessary and safe.

2. **Linter:** I use `ruff`.
   - Adhere to line length 88.
   - Sort imports (isort rules).

3. **Beancount Specifics:**
   - Beancount types are loose. Use `typing.TYPE_CHECKING` blocks to import `Transaction`, `Posting`, etc., from `beancount.core.data` without runtime overhead.
   - Metadata is a dict. Define `TypedDict` for any custom metadata fields.

# CHECKING CODE

Run `make check` to execute all of the linting, type checking, and linting. This runs fast and so should always pass.
