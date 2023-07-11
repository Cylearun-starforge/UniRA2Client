use crate::logger::{ClientLogger, CONSOLE};
use std::path::PathBuf;
use std::{env, process};

#[cfg(feature = "debug_redirect")]
fn get_client_dir_debug_redirect() -> PathBuf {
    use std::path;
    match env::var("UNIRA2_CLIENT_CWD") {
        Ok(cwd) => {
            let path = path::Path::new(&cwd);
            if path.exists() {
                return path.to_path_buf();
            }
            CONSOLE.warn("$UNIRA2_CLIENT_CWD points to a non-existing path");
            return get_client_current_dir();
        }

        Err(_) => return get_client_current_dir(),
    }
}

fn get_client_current_dir() -> PathBuf {
    match env::current_dir() {
        Ok(cwd) => cwd,
        Err(_) => {
            CONSOLE.error("Failed to get cwd");
            process::exit(-1);
        }
    }
}

#[cfg(feature = "debug_redirect")]
pub fn get_client_dir() -> PathBuf {
    get_client_dir_debug_redirect()
}

#[cfg(not(feature = "debug_redirect"))]
pub fn get_client_dir() -> PathBuf {
    get_client_current_dir()
}

pub fn get_map_dir() -> PathBuf {
    let mut dir = get_client_dir();
    dir.push("Maps");
    dir
}
