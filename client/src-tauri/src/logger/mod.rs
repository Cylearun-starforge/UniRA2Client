pub trait ClientLogger {
    fn info(&self, msg: &str);
    fn warn(&self, msg: &str);
    fn error(&self, msg: &str);
}

pub struct ConsoleLogger;

impl ClientLogger for ConsoleLogger {
    fn info(&self, msg: &str) {
        println!("INFO: {}", msg)
    }
    fn warn(&self, msg: &str) {
        println!("WARN: {}", msg)
    }
    fn error(&self, msg: &str) {
        eprintln!("ERROR: {}", msg)
    }
}
pub const CONSOLE: ConsoleLogger = ConsoleLogger;
