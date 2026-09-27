import gzip
import logging
import os
from collections.abc import Generator
from contextlib import contextmanager
from pathlib import Path

from pydantic import BaseModel, ValidationError

log = logging.getLogger(__name__)

logging.basicConfig(level=os.environ.get("LOGLEVEL", "INFO"))


@contextmanager
def load[T: BaseModel](dbfile: str, model: type[T], skip_save: bool = False, max_vers: int = 3) -> Generator[T]:
    """Load and save gzipped JSON model data with automatic backup rotation."""
    data: T

    try:
        path = Path(dbfile)

        if not path.is_file():
            try:
                data = model()
            except Exception:
                data = model.model_construct()
        else:
            with gzip.open(path, "rt", encoding="utf-8") as f:
                data = model.model_validate_json(f.read())
    except ValidationError:
        log.exception("Failed loading data from %s", dbfile)
        raise

    # Yield to the context
    # If there is an exception, it won't be saved
    yield data

    if skip_save:
        return

    new_json = data.model_dump_json(by_alias=True)

    # Check to see if data actually changed
    if path.exists():
        try:
            with gzip.open(path, mode="rt", encoding="utf-8") as old_f:
                if old_f.read() == new_json:
                    log.info("No data changed.")
                    return
        except Exception as e:
            log.debug("Could not verify existing cache: %s", e)

    tmp_data_path = Path(str(path) + ".tmp")

    # Remove temporary file if it exists
    if tmp_data_path.exists():
        tmp_data_path.unlink()

    # Write out the data to temporary file
    with gzip.open(tmp_data_path, mode="wt", encoding="utf-8", compresslevel=1) as f:
        _ = f.write(new_json)

    # Rotate database if it exists
    if path.exists():
        # Delete max version if it exists
        max_path = Path(str(path) + f".{max_vers}")
        if max_path.exists():
            max_path.unlink()

        # Rename previous versions
        for ver in list(reversed(range(1, max_vers))):
            vpath = Path(str(path) + f".{ver}")
            if vpath.exists():
                _ = vpath.rename(Path(str(path) + f".{ver + 1}"))

        # Rename first one
        _ = path.rename(Path(str(path) + ".1"))

    # Rename temporary path
    log.info("Saved data to %s", path)
    _ = tmp_data_path.rename(path)
